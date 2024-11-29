import React, { useState, useEffect } from 'react';

type EducationProps = {
  data: {
    graduationYear: string;
    levelOfStudy: string;
    campus: string;
    faculty: string;
  };
  updateData: (data: any) => void;
};

const graduationYears = ['2024', '2025', '2026', '2027', '2028', '2029'];
const levelsOfStudy = ['Undergraduate', 'Graduate', 'PhD'];
const campuses = ['St. George', 'Mississauga', 'Scarborough'];
const faculties = [
  'Faculty of Arts and Science',
  'Faculty of Applied Science and Engineering',
  'John H. Daniels Faculty of Architecture, Landscape, and Design',
  'Faculty of Dentistry',
  'Faculty of Information',
  'Faculty of Law',
  'Temerty Faculty of Medicine',
  'Dalla Lana School of Public Health',
  'Leslie Dan Faculty of Pharmacy',
  'Ontario Institute for Studies in Education (OISE)',
  'Rotman School of Management',
  'Faculty of Music',
  'Faculty of Nursing',
  'Faculty of Kinesiology and Physical Education',
  'School of Graduate Studies',
  'Munk School of Global Affairs and Public Policy',
  'Toronto School of Theology',
  'School of the Environment',
  'Institute of Biomedical Engineering',
  'Institute of Health Policy, Management and Evaluation',
  'School of Public Policy and Governance',
  'Faculty of Social Work',
  'Faculty of Forestry',
  'School of the Arts, Media, Performance & Design',
  'Faculty of Indigenous Studies',
  'School of Continuing Studies',
];

const Education: React.FC<EducationProps> = ({ data, updateData }) => {
  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    updateData(localData);
  }, [localData]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalData({
      ...localData,
      [name]: value,
    });
  };

  return (
    <div>
      <h2>Education</h2>
      <form>
        <label>Year of Graduation:</label>
        <select
          name="graduationYear"
          value={localData.graduationYear}
          onChange={handleChange}
        >
          <option value="">Select Year</option>
          {graduationYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <label>Level of Study:</label>
        <div className="level-of-study">
          {levelsOfStudy.map((level) => (
            <label key={level} className="level-option">
              <input
                type="radio"
                name="levelOfStudy"
                value={level}
                checked={localData.levelOfStudy === level}
                onChange={handleChange}
              />
              {level}
            </label>
          ))}
        </div>

        <label>Campus:</label>
        <select
          name="campus"
          value={localData.campus}
          onChange={handleChange}
        >
          <option value="">Select Campus</option>
          {campuses.map((campus) => (
            <option key={campus} value={campus}>
              {campus}
            </option>
          ))}
        </select>

        <label>Faculty:</label>
        <select
          name="faculty"
          value={localData.faculty}
          onChange={handleChange}
        >
          <option value="">Select Faculty</option>
          {faculties.map((faculty) => (
            <option key={faculty} value={faculty}>
              {faculty}
            </option>
          ))}
        </select>
      </form>
    </div>
  );
};

export default Education;
