import React, { useState, useEffect } from 'react';

type PersonalInfoProps = {
  data: {
    name: string;
    age: number;
    gender: string[];
    profilePicture: File | null;
  };
  updateData: (data: any) => void;
};

const genderOptions = [
  'Man',
  'Woman',
  'Trans or Transgender',
  'Non-binary',
  'Intersex',
  'I prefer to leave this blank',
  'Another Identity',
];

const PersonalInfo: React.FC<PersonalInfoProps> = ({ data, updateData }) => {
  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    updateData(localData);
  }, [localData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalData({
      ...localData,
      [name]: value,
    });
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    let updatedGender = [...localData.gender];
    if (checked) {
      updatedGender.push(value);
    } else {
      updatedGender = updatedGender.filter((gender) => gender !== value);
    }
    setLocalData({
      ...localData,
      gender: updatedGender,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLocalData({
        ...localData,
        profilePicture: e.target.files[0],
      });
    }
  };

  return (
    <div>
      <h2>Personal Information</h2>
      <form>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={localData.name}
          onChange={handleInputChange}
        />

        <label>Age:</label>
        <input
          type="number"
          name="age"
          value={localData.age}
          onChange={handleInputChange}
        />

        <label>Gender:</label>
        <div className="gender-grid">
          {genderOptions.map((option) => (
            <label key={option} className="gender-option">
              <input
                type="checkbox"
                value={option}
                checked={localData.gender.includes(option)}
                onChange={handleGenderChange}
              />
              {option}
            </label>
          ))}
        </div>

        <label>Profile Picture:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {localData.profilePicture && (
          <p>Selected file: {localData.profilePicture.name}</p>
        )}
      </form>
    </div>
  );
};

export default PersonalInfo;
