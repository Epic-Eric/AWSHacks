/**
 * Represents a person with preferences, including their name, age, and other personal data.
 */
class Preferences {
    /**
     * Initializes a new instance of the Preferences class based on a JSON object.
     * @param {Object} data - A JSON object containing the person's preferences (including Requirements and Description).
     */
    constructor(data) {
        // Initialize Requirements and Description from the data (fallback if not found)
        this.Requirements = data?.Preference?.Requirements || { Drinking: "False", Smoking: "False", NotClean: "False", Pets: "False", Gender: "False" };
        this.Description = data?.Preference?.Description || { Drinking: "False", Smoking: "False", NotClean: "False", Pets: "False", Gender: "False" };
    }

    /**
     * Compares two preferences (this and another person) based on specific Requirements and Descriptions.
     * @param {Preferences} anotherPreference - The other person's preferences to compare against.
     * @returns {boolean} - Returns false if the pair is banned, along with the reason.
     */
    compare(anotherPreference) {
        let reasons = [];

        // Gender preferences comparison (OR condition)
        if ((this.Requirements.Gender !== "False" && anotherPreference.Description.Gender !== "False" && this.Requirements.Gender !== anotherPreference.Description.Gender) ||
            (this.Description.Gender !== "False" && anotherPreference.Requirements.Gender !== "False" && this.Description.Gender !== anotherPreference.Requirements.Gender)) {
            reasons.push(`Gender preferences do not match. ${this.Requirements.Gender} vs ${anotherPreference.Description.Gender} (Requirements vs Description)`);
        }

        // Drinking preferences comparison (OR condition)
        if ((this.Requirements.Drinking === "True" && anotherPreference.Description.Drinking === "True") ||
            (this.Description.Drinking === "True" && anotherPreference.Requirements.Drinking === "True")) {
            reasons.push('Both people cannot drink (Requirements vs Description).');
        }

        // Smoking preferences comparison (OR condition)
        if ((this.Requirements.Smoking === "True" && anotherPreference.Description.Smoking === "True") ||
            (this.Description.Smoking === "True" && anotherPreference.Requirements.Smoking === "True")) {
            reasons.push('Both people cannot smoke (Requirements vs Description).');
        }

        // Cleanliness preferences comparison (OR condition)
        if ((this.Requirements.NotClean === "True" && anotherPreference.Description.NotClean === "True") ||
            (this.Description.NotClean === "True" && anotherPreference.Requirements.NotClean === "True")) {
            reasons.push('Both people are not clean (Requirements vs Description).');
        }

        // Pet preferences comparison (OR condition)
        if ((this.Requirements.Pets === "True" && anotherPreference.Description.Pets === "True") ||
            (this.Description.Pets === "True" && anotherPreference.Requirements.Pets === "True")) {
            reasons.push('Both people cannot have pets (Requirements vs Description).');
        }

        // If any reason was found, return false along with the reasons
        if (reasons.length > 0) {
            console.log(`Pair banned. Reasons: ${reasons.join(' ')}`);
            return false;
        }

        // If no issues, return true (no ban)
        console.log("Pair accepted.");
        return true;
    }
}

// Example usage with your updated gender preference logic

const person1Data = {
  "Name": "John",
  "Education": "Bachelors",
  "Age": 25,
  "Preference": {
    "Requirements": {
      "Drinking": "True",
      "Smoking": "False",
      "NotClean": "False",
      "Pets": "False",
      "Gender": "Male"
    },
    "Description": {
      "Drinking": "False",
      "Smoking": "False",
      "NotClean": "False",
      "Pets": "False",
      "Gender": "Male"
    }
  }
};

const person2Data = {
  "Name": "Jane",
  "Education": "Masters",
  "Age": 28,
  "Preference": {
    "Requirements": {
      "Drinking": "True",
      "Smoking": "False",
      "NotClean": "False",
      "Pets": "True",
      "Gender": "Female"
    },
    "Description": {
      "Drinking": "False",
      "Smoking": "False",
      "NotClean": "True",
      "Pets": "True",
      "Gender": "Female"
    }
  }
};

// Create Preference instances
const person1 = new Preferences(person1Data);
const person2 = new Preferences(person2Data);

// Compare person1 and person2
person1.compare(person2);