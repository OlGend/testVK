import React, { useState } from "react";
import Loader from "@/components/Loader/Loader";

const RegistrationModal = ({ ipDataCode, modalState, onUserKeywordChange }) => {
  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(true);



  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleCustomerio = () => {
    // Формируем объект с данными для отправки на первый сервер
    const data = {
      email: email,
      id: userData.id,
      login: userData.login,
      balance: userData.balance,
      country: userData.country,
      tickets: userData.tickets,
    };

    // Отправляем POST-запрос на API Customer.io
    fetch(`https://track-eu.customer.io/api/v1/customers/${userData}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 6f29015cd0560e7edf40", // Замените YOUR_API_KEY на ваш ключ API
      },
      body: JSON.stringify({
        name: "Registration", // Замените на имя вашего события
        data: data,
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log("Response from Customer.io:", responseData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleSubmit = () => {
    setIsLoading(true);
    // Отправляем GET-запрос на первый сервер
    fetch(
      `https://pickbonus.myawardwallet.com/api/registration/readdelete.php?`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((responseData) => {
        // Обработка данных, сохранение их для дальнейшей обработки
        setUserData(responseData);
        // После получения данных от первого сервера, отправляем их на второй сервер
        if (responseData) {
          sendUserDataToSecondServer(responseData);
          handleCustomerio();
          setIsLoading(false);
          modalState(false);
          onUserKeywordChange(responseData.id);
        } else {
          setIsLoading(false);
          modalState(false);

        }

        // Дополнительная обработка данных...
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const sendUserDataToSecondServer = (userData) => {
    // Формируем объект с данными для отправки на второй сервер
    const balanceValue = parseFloat(userData.balance).toFixed(2);
    const secondServerData = {
      id: userData.id,
      login: userData.login,
      VIP: userData.VIP,
      balance: balanceValue,
      country: ipDataCode,
      input: userData.input,
      password: userData.password,
      tickets: userData.tickets,
      winbalance: userData.winbalance,
      customer: "GURU",
    };

    // Отправляем POST-запрос на второй сервер
    fetch(`https://pickbonus.myawardwallet.com/api/user/create.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(secondServerData),
    })
      .then((response) => response.json())
      .then((responseData) => {
        // Обработка данных от второго сервера
        console.log("Response from second server:", responseData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };



  return (
    <div>
      {visible && (
        <div className="flex column items-center">
          {isLoading && <Loader />}
          <h4>
            Enter your email to become a VIP member and win guaranteed real
            money instantly!
          </h4>
          <input
            className="mb-3"
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />
          <button className="btn btn-primary" onClick={handleSubmit}>
            SUBMIT
          </button>
        </div>
      )}
    </div>
  );
};

export default RegistrationModal;