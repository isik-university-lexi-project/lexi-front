import styled from "styled-components";

export const StyledLoginpage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .login{
  display:absolute;
  font-size:40px;
  text-align:center;
  color:#D8BFD8;
  }

  .register{
  display:absolute;
  font-size:40px;
  text-align:center;
  color:#D8BFD8;
  }

  .login-container {
    background-color: #6b5b95;
    display: flex;
    width: 75%;
    max-width: 1200px;
    height: 80%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);


    .left {
      flex: 2;
      img {
        height: 100%;
        width: 190%;
      }
    }

    .right {
      flex: 1;
      padding: 50px;
      display: flex;
      flex-direction: column;
      justify-content: center; /* Ortalamayı sağlar */
      align-items: center; /* Yatayda ortalar */

      form {
        display: flex;
        flex-direction: column;
        width: 75%;
        max-width: 300px;
        gap: 20px; /* Elemanlar arası boşluk */
        right:70%;
        transform: translateX(10%);


        .form-element {
          position: relative;

          img {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            height: 25px;
            width: 25px;
            cursor: pointer;
            right:3%;
          }

          span {
            color: #d64161;
            font-size: 13px;
          }

          input {
            width: 100%;
            background-color: rgba(250, 250, 250, 0.8);
            border: none;
            border-bottom: 3px solid rgb(75, 0, 130);
            font-size: 15px;
            caret-color: #6b5b95;
            color: #8d9db6;
            line-height: 30px;

            ::placeholder {
              color: #6b5b95;
            }

            :focus {
              outline: none;
            }
          }
        }

        .form-element-submit {
          text-align: center;

          img{
          margin-top:10px;
          margin-bottom:10px;
          height:70px;
          width:70px;
          left:77%;
          transform: translateX(5%);
          transform: translateY(-50%);
          }

          button {
            background-color: #6b5b95;
            border: none;
            cursor: pointer;
            padding: 10px 20px;
            font-size: 18px;
            color: white;
          }
        }
      }

      .sign-up-info,
      .sign-up-btn-container {
        margin-top: 35px;
        text-align: center;
        color: #8d9db6;
        font-size:18px;
        width: 100%;
        right:20%;
        transform: translateX(0%);
      }

      .sign-up-btn-container {
        button {
          font-size: 28px;
          color: white;
          background-color: transparent;
          border: none;
          cursor: pointer;
          
        }
      }
    }
  }
`;
