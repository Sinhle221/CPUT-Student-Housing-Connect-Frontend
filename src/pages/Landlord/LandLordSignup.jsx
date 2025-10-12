import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LandLordSignup() {
    const [step, setStep] = useState(1);
    const [landlordData, setLandlordData] = useState({
        landlordFirstName: '',
        landlordLastName: '',
        password: '',
        dateRegistered: '',
        isVerified: false,
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

    useEffect(() => {
        setLandlordData(prev => ({
            ...prev,
            dateRegistered: new Date().toISOString()
        }));
    }, []);

    const handleLandlordChange = (e) => {
        const { name, value } = e.target;
        setLandlordData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleContactChange = (e) => {
        const { name, value, type, checked } = e.target;
        setContactData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (!landlordData.landlordFirstName || !landlordData.landlordLastName || !landlordData.password) {
            alert('Please fill all required fields.');
            return;
        }
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!contactData.email || !contactData.phoneNumber || !contactData.preferredContactMethod) {
            alert('Please fill all required contact fields.');
            setLoading(false);
            return;
        }

        const payload = {
            landlordFirstName: landlordData.landlordFirstName,
            landlordLastName: landlordData.landlordLastName,
            password: landlordData.password,
            isVerified: landlordData.isVerified ? 1 : 0,
            dateRegistered: landlordData.dateRegistered,
            contact: {
                email: contactData.email,
                phoneNumber: contactData.phoneNumber,
                alternatePhoneNumber: contactData.alternatePhoneNumber,
                isEmailVerified: contactData.isEmailVerified ? 1 : 0,
                isPhoneVerified: contactData.isPhoneVerified ? 1 : 0,
                preferredContactMethod: contactData.preferredContactMethod,
            }
        };

        try {
            const response = await fetch('http://localhost:8080/HouseConnect/UserAuthentication/api/auth/signup/landlord', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
                    <h2 className="form-title">Landlord Sign Up - Step 1</h2>
                    <form onSubmit={handleNext}>
                        <label htmlFor="landlordFirstName" style={{ fontWeight: 'bold', marginTop: 10 }}>First Name *</label>
                        <input
                            type="text"
                            id="landlordFirstName"
                            name="landlordFirstName"
                            placeholder="Enter your First Name"
                            value={landlordData.landlordFirstName}
                            onChange={handleLandlordChange}
                            required
                        />

                        <label htmlFor="landlordLastName" style={{ fontWeight: 'bold', marginTop: 10 }}>Last Name *</label>
                        <input
                            type="text"
                            id="landlordLastName"
                            name="landlordLastName"
                            placeholder="Enter your Last Name"
                            value={landlordData.landlordLastName}
                            onChange={handleLandlordChange}
                            required
                        />

                        <label htmlFor="password" style={{ fontWeight: 'bold', marginTop: 10 }}>Password *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={landlordData.password}
                            onChange={handleLandlordChange}
                            minLength="6"
                            required
                        />

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
                input[type="email"],
                input[type="password"],
                input[type="text"] {
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
                .login-button.orange {
                    background-color: #ff6600;
                    color: white;
                }
                .login-button.cancel {
                    background-color: #777;
                    color: white;
                    margin-top: 12px;
                }
                .login-button:hover:not(:disabled) {
                    opacity: 0.9;
                }
                .login-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                .login-button.cancel:hover {
                    background-color: #555;
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
                    input[type="text"] {
                        font-size: 15px;
                        padding: 12px 10px;
                    }
                }
            `}</style>
        </div>
    );
}

export default LandLordSignup;
