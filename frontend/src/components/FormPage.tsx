import React, { useState } from 'react';
import './FormPage.css';
import PersonalInfo from './PersonalInfo';
import Education from './Education';
import Interests from './Interests';
import Contact from './Contact';
import ProfileSummary from './ProfileSummary';

type FormData = {
    personalInfo: {
      name: string;
      age: number;
      gender: string[];
      profilePicture: File | null;
    };
    education: {
      graduationYear: string;
      levelOfStudy: string;
      campus: string;
      faculty: string;
    };
    interests: {
      pets: string;
      smokeVape: string;
      activitiesInterests: string;
      socialHabits: string[];
      studyPreferences: string;
      sleepHabits: string;
      cleanliness: string;
    };
    contact: {
      phone: string;
      instagram: string;
      snapchat: string;
      twitter: string;
    };
  };
  

const FormPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Personal');
  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      name: '',
      age: 0,
      gender: [],
      profilePicture: null,
    },
    education: {
      graduationYear: '',
      levelOfStudy: '',
      campus: '',
      faculty: '',
    },
    interests: {
      pets: '',
      smokeVape: '',
      dietaryRestrictions: '',
      activitiesInterests: '',
      socialHabits: [],
      studyPreferences: '',
      sleepHabits: '',
      cleanliness: '',
    },
    contact: {
      phone: '',
      instagram: '',
      snapchat: '',
      twitter: '',
    },
  });

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  const updateFormData = (section: string, data: any) => {
    setFormData({
      ...formData,
      [section]: data,
    });
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log('Form Data:', formData);
  };

  return (
    <div className="form-page-container">
      <div className="sidebar">
        <ul>
          <li onClick={() => handleTabClick('Personal')} className={activeTab === 'Personal' ? 'active' : ''}>
            Personal
          </li>
          <li onClick={() => handleTabClick('Education')} className={activeTab === 'Education' ? 'active' : ''}>
            Education
          </li>
          <li onClick={() => handleTabClick('Interests')} className={activeTab === 'Interests' ? 'active' : ''}>
            Interests
          </li>
          <li onClick={() => handleTabClick('Contact')} className={activeTab === 'Contact' ? 'active' : ''}>
            Contact
          </li>
          <li onClick={() => handleTabClick('Profile')} className={activeTab === 'Profile' ? 'active' : ''}>
            View My Profile
          </li>
        </ul>
      </div>
      <div className="content">
        {activeTab === 'Personal' && (
          <PersonalInfo data={formData.personalInfo} updateData={(data) => updateFormData('personalInfo', data)} />
        )}
        {activeTab === 'Education' && (
          <Education data={formData.education} updateData={(data) => updateFormData('education', data)} />
        )}
        {activeTab === 'Interests' && (
          <Interests data={formData.interests} updateData={(data) => updateFormData('interests', data)} />
        )}
        {activeTab === 'Contact' && (
          <Contact data={formData.contact} updateData={(data) => updateFormData('contact', data)} />
        )}
        {activeTab === 'Profile' && (
          <ProfileSummary formData={formData} handleSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
};

export default FormPage;
