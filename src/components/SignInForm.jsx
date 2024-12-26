import React, { useState } from "react";
import loginIcon from "../assets/arrow-icon.png.png";
import visibleIcon from "../assets/visible.png";
import unvisibleIcon from "../assets/unvisible.png";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Loader } from "./Loader";
import authStore from "../stores/authStore";
import { observer } from "mobx-react-lite";

//login form 
const SignInForm = ({ setVisibleLogin }) => {

    const [loading, setLoading] = useState(false);


    const navigate = useNavigate();

    const [visiblePassword, setVisiblePassword] = useState(false);

    const { register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        setLoading(true);
        authStore.login(data.name, data.password).then(response => {
            console.log("response", response)

            if (response.status == 200) {
                if (authStore.role === "seller") {
                    navigate('/product-list');
                } else {
                    navigate('/');
                }
            }


        }).catch(err => {
            console.log("error message", err)
        }).finally(() => {
            setLoading(false)
        });
    };

    return (

        <>

            <Loader loading={loading} />
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="login">LOGIN</div>
                <div className="form-element">
                    <input {...register("name", {
                        required: {
                            value: true, message: "Username is required",
                        },
                        minLength: {
                            value: 3, message: "Username cannot be less than 3 characters",
                        },
                        maxLength: {
                            value: 50, message: "Username cannot be more than 50 characters",
                        },
                    })}
                        placeholder="Username" type="text" />
                    <span>{errors?.name?.message} </span>

                </div>
                <div className="form-element">
                    <input {...register("password", {
                        required: { value: true, message: "This field is required" },

                    })}
                        placeholder="Password"
                        type={visiblePassword ? "text" : "password"}
                    />

                    <span>{errors?.password?.message} </span>


                    {visiblePassword ? (

                        <img onClick={() => setVisiblePassword(false)} src={unvisibleIcon} alt="unvisible-password"
                        />
                    ) : (
                        <img onClick={() => setVisiblePassword(true)}
                            src={visibleIcon}
                            alt="visible-password"
                        />
                    )}
                </div>

                <div className="form-element form-element-submit ">
                    <button>
                        <img src={loginIcon} alt="login-btn-icon" />
                    </button>
                </div>
            </form>

            <div className="sign-up-info">Not registered yet? </div>

            {authStore.errorMessage != "" && <div className="text-red-500">{authStore.errorMessage}</div>}
            <div className="sign-up-btn-container">
                <button onClick={() => setVisibleLogin(false)}>Register</button>
            </div>
        </>
    );
};


export default observer(SignInForm);

