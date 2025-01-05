import React, { useState } from "react";
import SignInForm from "../../components/SignInForm";
import loginImage from "../../assets/left-image.png.jpeg";
import { StyledLoginpage } from "./StyledLoginPage";
import SignUpForm from "../../components/SignUpForm";

export const Loginpage = () => {

   const [visibleLogin, setVisibleLogin] = useState(true);

   return <StyledLoginpage>
      <div className="login-container">
         <div className="left">

            <img src={loginImage} alt="login" />
         </div>
         <div className="right">
            {visibleLogin ? (
               <SignInForm setVisibleLogin={setVisibleLogin} />
            ) : (

               <SignUpForm setVisibleLogin={setVisibleLogin} />
            )}
         </div>
      </div>

   </StyledLoginpage>;



};