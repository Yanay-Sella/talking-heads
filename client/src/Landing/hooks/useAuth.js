import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContextProvider";

let logoutTimer;

const useAuth = () => {
  const { setUser, user, currentRoomId, setCurrentRoomId, socket } =
    useContext(UserContext);
  const [tokenExpoDate, setTokenExpoDate] = useState();

  const navigate = useNavigate();

  const login = useCallback(
    (user, tokenExpoDate = new Date(new Date().getTime() + 3600000)) => {
      setUser(user);
      setTokenExpoDate(tokenExpoDate);

      localStorage.setItem(
        "user",
        JSON.stringify({
          userId: user._id,
          token: user.token,
          expiration: tokenExpoDate.toISOString(),
        })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    socket.emit("userDisconnected", user._id, currentRoomId);
    setTokenExpoDate(null);
    setUser(null);
    setCurrentRoomId(null);
    navigate("/login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoomId]);

  useEffect(() => {
    if (tokenExpoDate) {
      const remainingTime = tokenExpoDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [logout, tokenExpoDate]);

  const relogin = useCallback(async () => {
    const storedData = JSON.parse(localStorage.getItem("user"));

    if (!storedData) return;
    // if (!storedData?.userId || !storedData?.token) return;

    const req = await fetch(
      `${process.env.REACT_APP_API_URL}/api/user/${storedData?.userId}`
    );
    const userData = await req.json();
    userData.token = storedData.token;
    if (userData) {
      login(userData, new Date(storedData.expiration));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    relogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { login, logout, relogin };
};

export default useAuth;
