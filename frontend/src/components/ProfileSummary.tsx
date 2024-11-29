import React from 'react';

type ProfileSummaryProps = {
  formData: any;
  handleSubmit: () => void;
};

const ProfileSummary: React.FC<ProfileSummaryProps> = ({ formData, handleSubmit }) => {
  const { personalInfo, education, interests, contact } = formData;

  return (
    <div>
      <h2>Profile Summary</h2>
      <div>
        <h3>Personal Information</h3>
        <p>Name: {personalInfo.name}</p>
        <p>Age: {personalInfo.age}</p>
        <p>Gender: {personalInfo.gender.join(', ')}</p>
        {personalInfo.profilePicture && (
          <p>Profile Picture: {personalInfo.profilePicture.name}</p>
        )}
      </div>
      <div>
        <h3>Education</h3>
        <p>Graduation Year: {education.graduationYear}</p>
        <p>Level of Study: {education.levelOfStudy}</p>
        <p>Campus: {education.campus}</p>
        <p>Faculty: {education.faculty}</p>
      </div>
      <div>
        <h3>Interests</h3>
        <p>Pets: {interests.pets}</p>
        <p>Smoke/Vape: {interests.smokeVape}</p>
        <p>About Me: {interests.activitiesInterests}</p>
        <p>Social Habits: {interests.socialHabits.join(', ')}</p>
        <p>Study Preferences: {interests.studyPreferences}</p>
        <p>Sleep Habits: {interests.sleepHabits}</p>
        <p>Cleanliness: {interests.cleanliness}</p>
      </div>
      <div>
        <h3>Contact Information</h3>
        <p>Phone: {contact.phone}</p>
        <p>Instagram: https://instagram.com/{contact.instagram}</p>
        <p>Snapchat: https://snapchat.com/add/{contact.snapchat}</p>
        <p>Twitter: @{contact.twitter}</p>
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default ProfileSummary;
