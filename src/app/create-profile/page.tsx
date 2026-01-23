'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { GraphQLClient, gql } from 'graphql-request';
import { useSession } from "next-auth/react";
import { CountryData } from '@/types/index'
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import LocationModal from '../component/locationModal.client'; // مسار الملف الجديد

// -------------------- GraphQL mutation --------------------
const COMPLETE_PROFILE = gql`
  mutation CompleteProfile($profileData: ProfileInput!) {
    completeStep3(profileData: $profileData) {
      id
      full_name
      phone
      location
      is_completed
    }
  }
`;

export default function CreateProfile() {
  const router = useRouter();
  const { data: session, status, update } = useSession();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user?.completed) router.push("/dashboard");
  }, [status, session, router]);

  const handleSave = async () => {
    if (!fullName || !phone || !location) {
      toast.error('Please fill all fields');
      return;
    }

    if (!session?.user?.id) {
      toast.error('Please sign in first');
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const client = new GraphQLClient(`${process.env.NEXT_PUBLIC_BASE_URL}/api/graphql`, { credentials: 'include' });
      const variables = { profileData: { full_name: fullName, phone, location } };
      const response = await client.request(COMPLETE_PROFILE, variables);

      if (response.completeStep3?.is_completed) {
        await update({ user: { ...session.user, completed: true } });
        toast.success('Profile completed successfully!');
        setTimeout(() => router.push('/dashboard'), 500);
      } else {
        toast.error('Failed to save profile');
      }
    } catch (error: unknown) {
      console.error('Profile completion error:', error);
      if (error instanceof Error) toast.error(error.message);
      else toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-[#733F3F] text-lg">Loading...</div>
    </div>
  );

  if (!session) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-lg">
        <h1 className="text-2xl font-bold text-[#592E2E] mb-6 text-center">
          One more step to get started
        </h1>

        {/* Full Name */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 font-medium text-[#733F3F]">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 border border-[#D6B2B2]/30 rounded-full focus:outline-none focus:border-[#733F3F] focus:ring-1 focus:ring-[#733F3F] transition"
            placeholder="eg Jenan Y.AbuHasanein"
            disabled={loading}
          />
        </div>

        {/* Phone Input */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 font-medium text-[#733F3F]">Phone Number</label>
          <PhoneInput
            country={'ps'}
            value={phone}
            onChange={(phoneValue: string, countryData: CountryData) => {
              setPhone(phoneValue);
              setCountry(countryData.name);
            }}

            inputStyle={{
              width: '100%',
              padding: '1rem 2.5rem', // نفس px-4 py-3
              borderRadius: '9999px', // same rounded-full
              border: '1px solid #D6B2B2',
              outline: 'none',
              transition: 'all 0.2s',
              color: '#000',
            }}
            buttonStyle={{
              borderRadius: '9999px', // لتنسيق العلم والdropdown
              border: '1px solid #D6B2B2',
            }}
            dropdownStyle={{
              borderRadius: '0.75rem',
              overflow: 'hidden',
            }}
            disableDropdown={false} // يسمح باختيار البلد
            disabled={loading}
          />
        </div>

        {/* Location Button */}
        <div className="flex flex-col mb-6">
          <label className="mb-1 font-medium text-[#733F3F]">Location</label>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full px-4 py-3 border border-[#D6B2B2]/30 rounded-full text-left focus:outline-none focus:border-[#733F3F] focus:ring-1 focus:ring-[#733F3F] transition text-gray-500"
          >
            {location || 'Click to set location'}
          </button>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className={`w-full py-4 rounded-full font-bold text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#592E2E] hover:bg-[#733F3F]"} transition-all shadow-lg`}
        >
          {loading ? "Saving..." : "Save"}
        </button>

        {/* Location Modal */}
        <LocationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          location={location}
          setLocation={setLocation}
        />
      </div>
    </div>
  );
}
