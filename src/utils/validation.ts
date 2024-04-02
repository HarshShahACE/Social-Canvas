// Check Email Validation
export const isEmailValid = (email : any) => {
    if(email === ''){
      window.alert('Please enter a valid Email ID');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// check Phone Number
export const isPhoneNumberValid = (phoneNumber :any) => {
    const phoneRegex = /^\d{10}$/; // Assumes 10-digit phone number, modify as needed
    return phoneRegex.test(phoneNumber);
};

// Check Password
export const isPasswordValid = (password :any) => {
    // Requires at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

// Password Validation For Login Page
export const handlepasswordcheck = (value : any) => {
    if ( value.trim() === '' ) {
      window.alert('Password Should Not Be Blank');
      return;
      }
    else{
      if(value.length <=7){
        window.alert('Password Length Should Not Be Below 8');
        return;
      }
      else{
        return true
      }
    }
}