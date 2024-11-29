import React, { useState, useEffect } from 'react';

type ContactProps = {
  data: {
    phone: string;
    instagram: string;
    snapchat: string;
    twitter: string;
  };
  updateData: (data: any) => void;
};

const Contact: React.FC<ContactProps> = ({ data, updateData }) => {
  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    updateData(localData);
  }, [localData]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;
    // Remove all non-digit characters
    value = value.replace(/\D/g, '');
    // Limit to 10 digits
    value = value.substring(0, 10);
    // Format as 123-456-7890
    const areaCode = value.substring(0, 3);
    const middle = value.substring(3, 6);
    const last = value.substring(6, 10);
    let formattedValue = '';
    if (value.length > 6) {
      formattedValue = `${areaCode}-${middle}-${last}`;
    } else if (value.length > 3) {
      formattedValue = `${areaCode}-${middle}`;
    } else if (value.length > 0) {
      formattedValue = `${areaCode}`;
    }
    setLocalData({
      ...localData,
      phone: formattedValue,
    });
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalData({
      ...localData,
      [name]: value,
    });
  };

  return (
    <div>
      <h2>Contact Information</h2>
      <form>
        <label>Phone (123-456-7890):</label>
        <input
          type="tel"
          name="phone"
          value={localData.phone}
          onChange={handlePhoneChange}
        />

        <label>Instagram:</label>
        <div className="social-input">
          <span className="prefix">https://instagram.com/</span>
          <input
            type="text"
            name="instagram"
            value={localData.instagram}
            onChange={handleSocialChange}
          />
        </div>

        <label>Snapchat:</label>
        <div className="social-input">
          <span className="prefix">https://snapchat.com/add/</span>
          <input
            type="text"
            name="snapchat"
            value={localData.snapchat}
            onChange={handleSocialChange}
          />
        </div>

        <label>Twitter:</label>
        <div className="social-input">
          <span className="prefix">@</span>
          <input
            type="text"
            name="twitter"
            value={localData.twitter}
            onChange={handleSocialChange}
          />
        </div>
      </form>
    </div>
  );
};

export default Contact;
