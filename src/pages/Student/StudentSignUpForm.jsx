import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function StudentSignUpForm() {
    const [step, setStep] = useState(1);
    const [studentData, setStudentData] = useState({
        studentName: '',
        studentSurname: '',
        dateOfBirth: '',
        gender: '',
        password: '', // Add password field
        registrationDate: '',
        isStudentVerified: false,
        fundingStatus: '',
    });

    const [contactData, setContactData] = useState({
        email: '',
        phoneNumber: '',
        alternatePhoneNumber: '',
        isEmailVerified: false,
        isPhoneVerified: false,
        preferredContactMethod: '',
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Set registrationDate automatically on mount
    useEffect(() => {
        setStudentData(prev => ({
            ...prev,
            registrationDate: new Date().toISOString()
        }));
    }, []);

    const handleStudentChange = (e) => {
        const { name, value, type, checked } = e.target;
        setStudentData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleContactChange = (e) => {
        const { name, value, type, checked } = e.target;
        setContactData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleNext = (e) => {
        e.preventDefault();
        
        // Validate required fields for step 1
        if (!studentData.studentName || !studentData.studentSurname || 
            !studentData.dateOfBirth || !studentData.gender || 
            !studentData.password || !studentData.fundingStatus) {
            alert('Please fill all required fields.');
            return;
        }
        
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validate required fields for step 2
        if (!contactData.email || !contactData.phoneNumber || !contactData.preferredContactMethod) {
            alert('Please fill all required contact fields.');
            setLoading(false);
            return;
        }

        // Prepare the payload to match backend expectations
        const payload = {
            studentName: studentData.studentName,
            studentSurname: studentData.studentSurname,
            dateOfBirth: studentData.dateOfBirth,
            gender: studentData.gender,
            password: studentData.password,
            isStudentVerified: studentData.isStudentVerified ? 1 : 0, // Convert boolean to 1/0
            fundingStatus: studentData.fundingStatus,
            contact: {
                email: contactData.email,
                phoneNumber: contactData.phoneNumber,
                alternatePhoneNumber: contactData.alternatePhoneNumber,
                isEmailVerified: contactData.isEmailVerified ? 1 : 0, // Convert boolean to 1/0
                isPhoneVerified: contactData.isPhoneVerified ? 1 : 0, // Convert boolean to 1/0
                preferredContactMethod: contactData.preferredContactMethod,
            }
        };

        console.log("Payload being sent to server:", JSON.stringify(payload, null, 2)); // Log the payload

        try {
            const response = await fetch('http://localhost:8080/HouseConnect/UserAuthentication/api/auth/signup/student', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const result = await response.json();
                alert('Registration successful! Welcome to our platform.');
                navigate('/login');
            } else {
                const errorData = await response.json();
                alert(`Registration failed: ${errorData.error || 'Unknown error occurred'}`);
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Error connecting to server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            {step === 1 && (
                <>
                    <h2 className="form-title">Student Sign Up - Step 1</h2>
                    <form onSubmit={handleNext}>
                        <label htmlFor="studentName" style={{ fontWeight: 'bold', marginTop: 10 }}>First Name *</label>
                        <input
                            type="text"
                            id="studentName"
                            name="studentName"
                            placeholder="Enter your First Name"
                            value={studentData.studentName}
                            onChange={handleStudentChange}
                            required
                        />

                        <label htmlFor="studentSurname" style={{ fontWeight: 'bold', marginTop: 10 }}>Last Name *</label>
                        <input
                            type="text"
                            id="studentSurname"
                            name="studentSurname"
                            placeholder="Enter your Last Name"
                            value={studentData.studentSurname}
                            onChange={handleStudentChange}
                            required
                        />

                        <label htmlFor="dateOfBirth" style={{ fontWeight: 'bold', marginTop: 10 }}>Date of Birth *</label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            value={studentData.dateOfBirth}
                            onChange={handleStudentChange}
                            required
                        />

                        <label style={{ fontWeight: 'bold', marginTop: 10, display: 'block' }}>Gender *</label>
                        <div className="radio-group">
                            <label>
                                <input type="radio" name="gender" value="Male" 
                                       checked={studentData.gender === 'Male'} 
                                       onChange={handleStudentChange} required />
                                Male
                            </label>
                            <label>
                                <input type="radio" name="gender" value="Female" 
                                       checked={studentData.gender === 'Female'} 
                                       onChange={handleStudentChange} required />
                                Female
                            </label>
                            <label>
                                <input type="radio" name="gender" value="Other" 
                                       checked={studentData.gender === 'Other'} 
                                       onChange={handleStudentChange} required />
                                Other
                            </label>
                        </div>

                        <label htmlFor="password" style={{ fontWeight: 'bold', marginTop: 10 }}>Password *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={studentData.password}
                            onChange={handleStudentChange}
                            minLength="6"
                            required
                        />

                        <div className="checkbox-group">
                            <label>
                                <input type="checkbox" name="isStudentVerified" 
                                       checked={studentData.isStudentVerified} 
                                       onChange={handleStudentChange} />
                                I am a verified student
                            </label>
                        </div>

                        <label style={{ fontWeight: 'bold', marginTop: 10, display: 'block' }}>Funding Status *</label>
                        <div className="radio-group">
                            <label>
                                <input type="radio" name="fundingStatus" value="FUNDED" 
                                       checked={studentData.fundingStatus === 'FUNDED'} 
                                       onChange={handleStudentChange} required />
                                Funded
                            </label>
                            <label>
                                <input type="radio" name="fundingStatus" value="SELF_FUNDED" 
                                       checked={studentData.fundingStatus === 'SELF_FUNDED'} 
                                       onChange={handleStudentChange} required />
                                Self Funded
                            </label>
                            <label>
                                <input type="radio" name="fundingStatus" value="NOT_FUNDED" 
                                       checked={studentData.fundingStatus === 'NOT_FUNDED'} 
                                       onChange={handleStudentChange} required />
                                Not Funded
                            </label>
                        </div>

                        <button type="submit" className="login-button orange">Next</button>
                        <button type="button" className="login-button cancel" onClick={() => navigate('/')}>Cancel</button>
                    </form>
                </>
            )}

            {step === 2 && (
                <>
                    <h2 className="form-title">Contact Details - Step 2</h2>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email" style={{ fontWeight: 'bold', marginTop: 10 }}>Email *</label>
                        <input type="email" name="email" 
                               placeholder="Email Address" 
                               value={contactData.email} 
                               onChange={handleContactChange} required />

                        <label htmlFor="phoneNumber" style={{ fontWeight: 'bold', marginTop: 10 }}>Phone Number *</label>
                        <input type="text" name="phoneNumber" 
                               placeholder="Phone Number" 
                               value={contactData.phoneNumber} 
                               onChange={handleContactChange} required />

                        <label htmlFor="alternatePhoneNumber" style={{ fontWeight: 'bold', marginTop: 10 }}>Alternate Phone Number</label>
                        <input type="text" name="alternatePhoneNumber" 
                               placeholder="Alternate Phone Number" 
                               value={contactData.alternatePhoneNumber} 
                               onChange={handleContactChange} />

                        <div className="checkbox-group">
                            <label>
                                <input type="checkbox" name="isEmailVerified" 
                                       checked={contactData.isEmailVerified} 
                                       onChange={handleContactChange} />
                                Email Verified
                            </label>
                            <label>
                                <input type="checkbox" name="isPhoneVerified" 
                                       checked={contactData.isPhoneVerified} 
                                       onChange={handleContactChange} />
                                Phone Verified
                            </label>
                        </div>

                        <label style={{ fontWeight: 'bold', marginTop: 10, display: 'block' }}>Preferred Contact Method *</label>
                        <div className="radio-group">
                            <label>
                                <input type="radio" name="preferredContactMethod" value="EMAIL" 
                                       checked={contactData.preferredContactMethod === 'EMAIL'} 
                                       onChange={handleContactChange} required />
                                Email
                            </label>
                            <label>
                                <input type="radio" name="preferredContactMethod" value="PHONE" 
                                       checked={contactData.preferredContactMethod === 'PHONE'} 
                                       onChange={handleContactChange} required />
                                Phone
                            </label>
                            <label>
                                <input type="radio" name="preferredContactMethod" value="ALTERNATE_PHONE" 
                                       checked={contactData.preferredContactMethod === 'ALTERNATE_PHONE'} 
                                       onChange={handleContactChange} required />
                                Alternate Phone
                            </label>
                        </div>

                        <button type="submit" className="login-button orange" disabled={loading}>
                            {loading ? 'Signing Up...' : 'Sign Up'}
                        </button>
                        <button type="button" className="login-button cancel" onClick={() => setStep(1)}>Back</button>
                    </form>
                </>
            )}

            {/* Inline CSS for the form */}
            <style>{`
        .form-container {
    max-width: 600px;
    margin: 60px auto;
    padding: 40px 40px;
    background-color: #f8f8f8;
    border-radius: 16px;
    box-shadow: 0 0 16px rgba(0, 0, 0, 0.12);
    position: relative;
  }
  .form-title {
    font-weight: bold;
    text-align: center;
    margin-bottom: 18px;
    font-size: 22px;
    color: #000;
  }
  .login-line {
    width: 100%;
    height: 6px;
    background: linear-gradient(to right, #003366 25%, #ff6600 25%, #ff6600 50%, #ccc 50%, #003366 75%);
    margin-bottom: 30px;
  }
  input[type="email"],
  input[type="password"],
  input[type="text"],
  input[type="date"],
  input[type="datetime-local"] {
    width: 100%;
    padding: 16px 18px;
    margin: 16px 0;
    border-radius: 10px;
    border: 1px solid #ccc;
    background-color: #eaeaea;
    font-size: 17px;
    box-sizing: border-box;
  }
  .login-button {
    width: 100%;
    padding: 18px;
    margin-top: 18px;
    border: none;
    border-radius: 10px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s;
  }
  .login-button.gray {
    background-color: #d9d9d9;
    color: black;
  }
  .login-button.orange {
    background-color: #ff6600;
    color: white;
  }
  .login-button:hover:not(:disabled) {
    opacity: 0.9;
  }
  .login-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .login-button.cancel {
    background-color: #777;
    color: white;
    margin-top: 12px;
  }
  .login-button.cancel:hover {
    background-color: #555;
  }
  .forgot-text {
    text-align: center;
    margin-top: 12px;
    font-size: 15px;
    color: #333;
    cursor: pointer;
    text-decoration: underline;
  }
  .back-arrow {
    position: absolute;
    left: 20px;
    top: 20px;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
  }
  .radio-group {
    display: flex;
    justify-content: flex-start;
    gap: 35px;
    margin: 24px 0;
  }
  .radio-group label {
    font-size: 18px;
    color: #333;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .checkbox-group {
    display: flex;
    gap: 35px;
    margin: 24px 0;
  }
  .checkbox-group label {
    font-size: 18px;
    color: #333;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  @media (max-width: 700px) {
    .form-container {
      width: 98%;
      padding: 16px;
      max-width: 98vw;
    }
    .form-title {
      font-size: 18px;
    }
    .login-button {
      font-size: 16px;
    }
    input[type="email"],
    input[type="password"],
    input[type="text"],
    input[type="date"],
    input[type="datetime-local"] {
      font-size: 15px;
      padding: 12px 10px;
    }
  }
`}</style>
        </div>
    );
}

export default StudentSignUpForm;


//Old code below with on connection to the backend.
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// function StudentSignUpForm() {
//     const [step, setStep] = useState(1);
//     const [studentData, setStudentData] = useState({
//         studentName: '',
//         studentSurname: '',
//         dateOfBirth: '',
//         gender: '',
//         studentNumber: '',
//         registrationDate: '',
//         isStudentVerified: false,
//         fundingStatus: '',
//     });

//     const [contactData, setContactData] = useState({
//         email: '',
//         phoneNumber: '',
//         alternatePhoneNumber: '',
//         isEmailVerified: false,
//         isPhoneVerified: false,
//         preferredContactMethod: '',
//     });

//     const navigate = useNavigate();

//     // Set registrationDate automatically on mount
//     useEffect(() => {
//         setStudentData(prev => ({
//             ...prev,
//             registrationDate: new Date().toISOString()
//         }));
//     }, []);

//     const handleStudentChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setStudentData((prev) => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked : value,
//         }));
//     };

//     const handleContactChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setContactData((prev) => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked : value,
//         }));
//     };

//     const handleNext = (e) => {
//         e.preventDefault();
//         navigate('/contact');
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const payload = {
//             ...studentData,
//             contact: { ...contactData },
//         };

//         try {
//             const response = await fetch('/api/auth/signup/student', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(payload),
//             });

//             if (response.ok) {
//                 alert('Signup successful!');
//                 navigate('/login');
//             } else {
//                 alert('Signup failed. Please check your details.');
//             }
//         } catch (error) {
//             alert('Error connecting to server.');
//         }
//     };

//     return (
//         <div className="form-container">
//             {step === 1 && (
//                 <>
//                     <h2 className="form-title">Student Sign Up</h2>
//                     <form onSubmit={handleNext}>
//                         <label htmlFor="studentName" style={{ fontWeight: 'bold', marginTop: 10 }}>First Name</label>
//                         <input
//                             type="text"
//                             id="studentName"
//                             name="studentName"
//                             placeholder="Enter your First Name"
//                             value={studentData.studentName}
//                             onChange={handleStudentChange}
//                             required
//                         />

//                         <label htmlFor="studentSurname" style={{ fontWeight: 'bold', marginTop: 10 }}>Last Name</label>
//                         <input
//                             type="text"
//                             id="studentSurname"
//                             name="studentSurname"
//                             placeholder="Enter your Last Name"
//                             value={studentData.studentSurname}
//                             onChange={handleStudentChange}
//                             required
//                         />

//                         <label htmlFor="dateOfBirth" style={{ fontWeight: 'bold', marginTop: 10 }}>Date of Birth</label>
//                         <input
//                             type="date"
//                             id="dateOfBirth"
//                             name="dateOfBirth"
//                             value={studentData.dateOfBirth}
//                             onChange={handleStudentChange}
//                             required
//                         />

//                         <div className="radio-group">
//                             <label>
//                                 <input type="radio" name="gender" value="Male" checked={studentData.gender === 'Male'} onChange={handleStudentChange} required />
//                                 Male
//                             </label>
//                             <label>
//                                 <input type="radio" name="gender" value="Female" checked={studentData.gender === 'Female'} onChange={handleStudentChange} required />
//                                 Female
//                             </label>
//                             <label>
//                                 <input type="radio" name="gender" value="Other" checked={studentData.gender === 'Other'} onChange={handleStudentChange} required />
//                                 Other
//                             </label>
//                         </div>

//                         <label htmlFor="studentNumber" style={{ fontWeight: 'bold', marginTop: 10 }}>Student Number</label>
//                         <input
//                             type="text"
//                             id="studentNumber"
//                             name="studentNumber"
//                             placeholder="Enter your Student Number"
//                             value={studentData.studentNumber}
//                             onChange={handleStudentChange}
//                             required
//                         />
//                         {/* Registration date is now hidden and set automatically */}

//                         <div className="checkbox-group">
//                             <label>
//                                 <input type="checkbox" name="isStudentVerified" checked={studentData.isStudentVerified} onChange={handleStudentChange} />
//                                 Verified Student
//                             </label>
//                         </div>

//                         <div className="radio-group">
//                             <label>
//                                 <input type="radio" name="fundingStatus" value="FUNDED" checked={studentData.fundingStatus === 'FUNDED'} onChange={handleStudentChange} required />
//                                 Funded
//                             </label>
//                             <label>
//                                 <input type="radio" name="fundingStatus" value="SELF_FUNDED" checked={studentData.fundingStatus === 'SELF_FUNDED'} onChange={handleStudentChange} required />
//                                 Self Funded
//                             </label>
//                             <label>
//                                 <input type="radio" name="fundingStatus" value="NOT_FUNDED" checked={studentData.fundingStatus === 'NOT_FUNDED'} onChange={handleStudentChange} required />
//                                 Not Funded
//                             </label>
//                         </div>

//                         <button type="submit" className="login-button orange">Next</button>
//                         <button type="button" className="login-button cancel" onClick={() => navigate('/')}>Cancel</button>
//                     </form>
//                 </>
//             )}

//             {step === 2 && (
//                 <>
//                     <h2 className="form-title">Contact Details</h2>
//                     <form onSubmit={handleSubmit}>
//                         <input type="email" name="email" placeholder="Email Address" value={contactData.email} onChange={handleContactChange} required />
//                         <input type="text" name="phoneNumber" placeholder="Phone Number" value={contactData.phoneNumber} onChange={handleContactChange} required />
//                         <input type="text" name="alternatePhoneNumber" placeholder="Alternate Phone Number" value={contactData.alternatePhoneNumber} onChange={handleContactChange} />

//                         <div className="checkbox-group">
//                             <label>
//                                 <input type="checkbox" name="isEmailVerified" checked={contactData.isEmailVerified} onChange={handleContactChange} />
//                                 Email Verified
//                             </label>
//                             <label>
//                                 <input type="checkbox" name="isPhoneVerified" checked={contactData.isPhoneVerified} onChange={handleContactChange} />
//                                 Phone Verified
//                             </label>
//                         </div>

//                         <div className="radio-group">
//                             <label>
//                                 <input type="radio" name="preferredContactMethod" value="EMAIL" checked={contactData.preferredContactMethod === 'EMAIL'} onChange={handleContactChange} required />
//                                 Email
//                             </label>
//                             <label>
//                                 <input type="radio" name="preferredContactMethod" value="PHONE" checked={contactData.preferredContactMethod === 'PHONE'} onChange={handleContactChange} required />
//                                 Phone
//                             </label>
//                             <label>
//                                 <input type="radio" name="preferredContactMethod" value="ALTERNATE_PHONE" checked={contactData.preferredContactMethod === 'ALTERNATE_PHONE'} onChange={handleContactChange} required />
//                                 Alternate Phone
//                             </label>
//                         </div>

//                         <button type="submit" className="login-button orange">Sign Up</button>
//                         <button type="button" className="login-button cancel" onClick={() => setStep(1)}>Back</button>
//                     </form>
//                 </>
//             )}

//             {/* Inline CSS for the form */}
//             <style>{`
//         .form-container {
//     max-width: 600px;
//     margin: 60px auto;
//     padding: 40px 40px;
//     background-color: #f8f8f8;
//     border-radius: 16px;
//     box-shadow: 0 0 16px rgba(0, 0, 0, 0.12);
//     position: relative;
//   }
//   .form-title {
//     font-weight: bold;
//     text-align: center;
//     margin-bottom: 18px;
//     font-size: 22px;
//     color: #000;
//   }
//   .login-line {
//     width: 100%;
//     height: 6px;
//     background: linear-gradient(to right, #003366 25%, #ff6600 25%, #ff6600 50%, #ccc 50%, #003366 75%);
//     margin-bottom: 30px;
//   }
//   input[type="email"],
//   input[type="studentNumber"],
//   input[type="text"],
//   input[type="date"],
//   input[type="datetime-local"] {
//     width: 100%;
//     padding: 16px 18px;
//     margin: 16px 0;
//     border-radius: 10px;
//     border: 1px solid #ccc;
//     background-color: #eaeaea;
//     font-size: 17px;
//     box-sizing: border-box;
//   }
//   .login-button {
//     width: 100%;
//     padding: 18px;
//     margin-top: 18px;
//     border: none;
//     border-radius: 10px;
//     font-size: 18px;
//     font-weight: bold;
//     cursor: pointer;
//     transition: 0.3s;
//   }
//   .login-button.gray {
//     background-color: #d9d9d9;
//     color: black;
//   }
//   .login-button.orange {
//     background-color: #ff6600;
//     color: white;
//   }
//   .login-button:hover {
//     opacity: 0.9;
//   }
//   .login-button.cancel {
//     background-color: #777;
//     color: white;
//     margin-top: 12px;
//   }
//   .login-button.cancel:hover {
//     background-color: #555;
//   }
//   .forgot-text {
//     text-align: center;
//     margin-top: 12px;
//     font-size: 15px;
//     color: #333;
//     cursor: pointer;
//     text-decoration: underline;
//   }
//   .back-arrow {
//     position: absolute;
//     left: 20px;
//     top: 20px;
//     font-size: 24px;
//     font-weight: bold;
//     cursor: pointer;
//   }
//   .radio-group {
//     display: flex;
//     justify-content: flex-start;
//     gap: 35px;
//     margin: 24px 0;
//   }
//   .radio-group label {
//     font-size: 18px;
//     color: #333;
//     display: flex;
//     align-items: center;
//     gap: 10px;
//   }
//   @media (max-width: 700px) {
//     .form-container {
//       width: 98%;
//       padding: 16px;
//       max-width: 98vw;
//     }
//     .form-title {
//       font-size: 18px;
//     }
//     .login-button {
//       font-size: 16px;
//     }
//     input[type="email"],
//     input[type="studentNumber"],
//     input[type="text"],
//     input[type="date"],
//     input[type="datetime-local"] {
//       font-size: 15px;
//       padding: 12px 10px;
//     }
//   }
// `}</style>
//         </div>
//     );
// }

// export default StudentSignUpForm;