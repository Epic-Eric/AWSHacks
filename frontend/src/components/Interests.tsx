import React, { useState, useEffect } from 'react';

type InterestsProps = {
  data: {
    pets: string;
    smokeVape: string;
    activitiesInterests: string;
    socialHabits: string[];
    studyPreferences: string;
    sleepHabits: string;
    cleanliness: string;
  };
  updateData: (data: any) => void;
};

const petOptions = ['Cats', 'Dogs', 'Others', 'No'];
const smokeOptions = ['Never smoke', 'Sometimes', 'Often', 'Always'];
const socialHabitsOptions = ['Host parties at home', 'Go out to parties', 'Alcohol-Free'];
const studyPreferencesOptions = ['At home', 'In library', 'Other'];
const sleepHabitsOptions = ['Morning person', 'Night person', 'Flexible'];
const cleanlinessOptions = ['Extremely neat', 'Neat', 'Messy'];

const Interests: React.FC<InterestsProps> = ({ data, updateData }) => {
  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    updateData(localData);
  }, [localData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLocalData({
      ...localData,
      [name]: value,
    });
  };

  const handleSocialHabitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    let updatedHabits = [...localData.socialHabits];
    if (checked) {
      updatedHabits.push(value);
    } else {
      updatedHabits = updatedHabits.filter((habit) => habit !== value);
    }
    setLocalData({
      ...localData,
      socialHabits: updatedHabits,
    });
  };

  return (
    <div>
      <h2>Interests</h2>
      <form>
        <label>Pets:</label>
        <select name="pets" value={localData.pets} onChange={handleChange}>
          <option value="">Select Option</option>
          {petOptions.map((pet) => (
            <option key={pet} value={pet}>
              {pet}
            </option>
          ))}
        </select>

        <label>Smoke / Vape:</label>
        <select name="smokeVape" value={localData.smokeVape} onChange={handleChange}>
          <option value="">Select Option</option>
          {smokeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <label>
          Tell more about yourself. What are your hobbies, including sports and other activities:
        </label>
        <textarea
          name="activitiesInterests"
          value={localData.activitiesInterests}
          onChange={handleChange}
        ></textarea>

        <label>Social Habits:</label>
        <div className="social-habits">
          {socialHabitsOptions.map((habit) => (
            <label key={habit} className="habit-option">
              <input
                type="checkbox"
                value={habit}
                checked={localData.socialHabits.includes(habit)}
                onChange={handleSocialHabitsChange}
              />
              {habit}
            </label>
          ))}
        </div>

        <label>Study Preferences:</label>
        <select
          name="studyPreferences"
          value={localData.studyPreferences}
          onChange={handleChange}
        >
          <option value="">Select Option</option>
          {studyPreferencesOptions.map((pref) => (
            <option key={pref} value={pref}>
              {pref}
            </option>
          ))}
        </select>

        <label>Sleep Habits:</label>
        <select name="sleepHabits" value={localData.sleepHabits} onChange={handleChange}>
          <option value="">Select Option</option>
          {sleepHabitsOptions.map((habit) => (
            <option key={habit} value={habit}>
              {habit}
            </option>
          ))}
        </select>

        <label>Cleanliness:</label>
        <select name="cleanliness" value={localData.cleanliness} onChange={handleChange}>
          <option value="">Select Option</option>
          {cleanlinessOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </form>
    </div>
  );
};

export default Interests;
