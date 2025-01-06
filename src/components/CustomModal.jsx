import React, { useCallback, useRef } from "react";
import styled from "styled-components";
import { useClickOutside } from "../hooks/useClickOutside";


const StyledCustomModal = styled.div`

position:fixed;
left:0;
top:0;
height:100vh;
background-color:rgba(184, 169, 201, 0.7);
width:100%;
z-index:99;

.modal-container{
background-color: #d64161;
margin:auto;
padding:50px 100px;
text-color:#FFFF;
color:black;
}

.modal-buttons{
    margin-top:20px;
    display:flex;
    justify-content:space-evenly;
    
}

.ok-button{

    border:2px solid #463D4B;
    border-radius: 10px;
    padding:10px 40px;
    color:#FFFF;
    background-color:#FF6F6F;  /
    cursor: pointer;
    transition: all 0.3s ease;

    :hover{
    opacity:0.8;
    background-color: #c83349;
    }
  
}

`;



// type : warning, confirm
export const CustomModal = ({ displayModal, onOk, onCancel, children, type }) => {


    const modalRef = useRef();

    const divStyle = {
        display: displayModal ? 'flex' : 'none',
    };

    useClickOutside(modalRef, onCancel);

    const handleOk = useCallback((e) => {
        e.stopPropagation();
        onOk();
    }, [onOk]
    );

    const handleCancel = useCallback((e) => {
        e.stopPropagation();
        onCancel();
    }, [onCancel]
    );

    return (
        <StyledCustomModal style={divStyle}>

            <div ref={modalRef} className="modal-container" >
                <div className="modal-content"  >
                    {children}
                </div>

                <div className="modal-buttons">

                    {type === 'confirm' && (
                        <>
                            <button className="ok-button" onClick={handleOk} >YES </button>
                            <button className="no-button" onClick={handleCancel}>NO </button>
                        </>
                    )}

                    {type === 'warning' && (
                        <>
                            <button className="ok-button" onClick={handleCancel} >OK </button>

                        </>
                    )}
                </div>
            </div>
        </StyledCustomModal>
    );
};