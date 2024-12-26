import React from "react";
import styled from "styled-components";
import {useSpring, animated} from "react-spring";

const StyledLoader=styled.div`

position:fixed;
left:0;
top:0;
width:100%;
height:100vh;
background-color: rgba(234, 176, 247, 0.8);
z-index:999;
display:flex;
justify-content:center;
align-items:center;
flex-direction:column;


.loader{
width:50px;
height:50px;
border-radius:50%;
border:10px solid rgba(198, 185, 201, 0.8);
border-top:10px solid rgba(133, 6, 161, 0.8);
animation:anim 2s linear infinite;

}

.loading-text {
    margin-top: 20px; 
    font-size: 20px;
    font-weight: bold;    
    color:rgba(34, 5, 41, 0.8);
    text-align:center;
  }

    @keyframes anim{
        0%{
            transform:rotate(0deg);
        }
        100%{
            transform:rotate(360deg);
        }
    }
    
    

`;

export const Loader = ({loading}) => {

    const styles=useSpring({
        loop:true,
        to:[
            {opacity:0.8, color:"purple"},
            {opacity:0.4, color:"blue"},
            {opacity:1, color:"yellow"},
        ],

        from:{opacity:0, color:"red" },
        
        config:{duration: 2000}

    });

    return (
        loading && (
    
        <StyledLoader> 
            <div className="loader"> </div>
            <animated.div className="loading-text" style={styles}>Loading...</animated.div>
            

        </StyledLoader>
 )
    );
};