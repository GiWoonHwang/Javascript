class Validation {
    constructor(){}

    valid_email_check(email){
        const pattern = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
        
        return pattern.test(email)
    };
    // 01-26 수정
    valid_pwd_check(password){ // 비밀번호 영문 숫자, 특수문자 다 있는지 화인
        let pattern1 = /[0-9]/; 
        // 숫자 
        let pattern2 = /[a-zA-Z]/; 
        // 문자 
        let pattern3 = /[~!@#$%^&*()_+|<>?:{}]/; 
        // 특수문자 
        if(!pattern1.test(password) || !pattern2.test(password) || !pattern3.test(password) || str.length < 8) { 
            alert("비밀번호는 8자리 이상 문자, 숫자, 특수문자로 구성하여야 합니다.");
             return false; 
        } else { 
            return true; 
        } 
    };
    valid_pwd_trim(password){ // 공백 확인
        if(password.search(/\s/) != -1){
            return false
    }};
    valid_pwd_length(password){ // 비밀번호 길이 확인
        if(password.length < 8 || password.length > 20){
            return false
    }};
    valid_user_check(user){
        if(user != null){
            return false
    }};
    valid_pwd_double_check(password,password2){
        if(password != password2){
            return false
    }
    }
};
module.exports =  Validation