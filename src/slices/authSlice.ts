import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// --- 1. تعريف الـ Mutations الجديدة ---

const SIGNUP_STEP1_MUTATION = `
  mutation SignupStep1($email: String!, $password: String!) {
    signupStep1(email: $email, passwordHash: $password) {
      token
      user { id email is_verifid is_completed role }
    }
  }
`;

const VERIFY_OTP_MUTATION = `
  mutation VerifyStep2($userId: String!, $otp: String!) {
    verifyStep2(userId: $userId, otp: $otp) {
      id is_verifid is_completed
    }
  }
`;

const COMPLETE_PROFILE_MUTATION = `
  mutation CompleteStep3($userId: String!, $profileData: ProfileInput!) {
    completeStep3(userId: $userId, profileData: $profileData) {
      id full_name phone location is_completed
    }
  }
`;

// --- 2. تعريف الأنواع (Interfaces) ---

interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
  is_verifid: boolean;   // تأكدي من مطابقة الاسم في السكيما (verifid)
  is_completed: boolean;
  phone?: string;
  location?: string;
}

interface AuthState {
  currentUser: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

// --- 3. الدوال المساعدة للطلبات ---

const GRAPHQL_ENDPOINT = '/api/graphql';

async function graphqlRequest<T>(query: string, variables?: Record<string, unknown>) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data as T;
}

// --- 4. الـ Thunks (العمليات) ---

// الخطوة 1: التسجيل المبدئي
export const signupStep1 = createAsyncThunk(
  'auth/signupStep1',
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      // const data = await graphqlRequest(SIGNUP_STEP1_MUTATION, credentials);

      const data = await graphqlRequest<{ signupStep1: { token: string; user: User } }>(
        SIGNUP_STEP1_MUTATION,
        credentials as unknown as Record<string, unknown>
      );
      localStorage.setItem('token', data.signupStep1.token);
      return data.signupStep1;
    } catch (err) {
      return thunkAPI.rejectWithValue(err instanceof Error ? err.message : 'Signup failed');
    }
  }
);

// الخطوة 2: التحقق من الكود
export const verifyOtp = createAsyncThunk<
  { id: string; is_verifid: boolean; is_completed: boolean }, // نوع البيانات الراجعة
  { userId: string; otp: string },                            // نوع المدخلات
  { rejectValue: string }                                     // نوع الخطأ
>(
  'auth/verifyOtp',
  async (args, thunkAPI) => {
    try {
      // نحدد هنا شكل الـ data المتوقع من الجراف كيو إل
      const data = await graphqlRequest<{ verifyStep2: { id: string; is_verifid: boolean; is_completed: boolean } }>(
        VERIFY_OTP_MUTATION,
        args as unknown as Record<string, unknown>
      );
      
      return data.verifyStep2;
    } catch (err) {
      return thunkAPI.rejectWithValue(err instanceof Error ? err.message : 'Verification failed');
    }
  }
);

// الخطوة 3: إكمال البروفايل
export const completeProfile = createAsyncThunk(
  'auth/completeProfile',
  async (args: { userId: string; profileData: { full_name: string; phone: string; location: string } }, thunkAPI) => {
    try {
      // const data = await graphqlRequest(COMPLETE_PROFILE_MUTATION, args);
      const data = await graphqlRequest<{ completeStep3: User }>(
        COMPLETE_PROFILE_MUTATION,
        args as unknown as Record<string, unknown>
      );
      return data.completeStep3;
    } catch (err) {
      return thunkAPI.rejectWithValue(err instanceof Error ? err.message : 'Update failed');
    }
  }
);

export const checkEmail = createAsyncThunk<
  boolean,             // نوع البيانات الراجعة (true إذا موجود)
  string,              // نوع المدخلات (الإيميل)
  { rejectValue: string }
>(
  'auth/checkEmail',
  async (email, thunkAPI) => {
    try {
      const data = await graphqlRequest<{ isEmailTaken: boolean }>(
        `
        query IsEmailTaken($email: String!) {
          isEmailTaken(email: $email)
        }
        `,
        { email }
      );
      return data.isEmailTaken;
    } catch (err) {
      return thunkAPI.rejectWithValue(err instanceof Error ? err.message : 'Email check failed');
    }
  }
);

// --- 5. الـ Slice ---

const initialState: AuthState = {
  currentUser: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup Step 1
      .addCase(signupStep1.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(signupStep1.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.currentUser = action.payload.user;
      })
      .addCase(signupStep1.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Verify OTP
      .addCase(verifyOtp.fulfilled, (state, action) => {
        if (state.currentUser) {
          state.currentUser.is_verifid = action.payload.is_verifid;
        }
      })
      // Complete Profile
      .addCase(completeProfile.fulfilled, (state, action) => {
        if (state.currentUser) {
          state.currentUser = { ...state.currentUser, ...action.payload };
        }
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;