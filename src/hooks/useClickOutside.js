import React from "react";
import { useEffect } from "react";


export const useClickOutside = (ref, callbackFn) => {

useEffect(() => {

function handleOutsideClick(event){
    if(ref?.current && !ref.current.contains(event.target) ){
    callbackFn();
    }
}

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
    }

}, [ref, callbackFn]);


}