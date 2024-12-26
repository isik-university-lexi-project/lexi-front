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
background-color: #622569;
margin:auto;
padding:50px 100px;

}

.modal-buttons{
    margin-top:20px;
    display:flex;
    justify-content:space-evenly;
}

.ok-button,
.no-button{

    border:none;
    padding:10px 40px;
    color:#622569;
    cursor:pointer;

    :hover{
    opacity:0.8;
    }
}

.no-button{
background-color: #c83349;
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