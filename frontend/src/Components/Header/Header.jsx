import { lazy, Suspense, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useMatch } from "react-router-dom";
import logout from "../Auth/Logout";

import { Button } from "../Common";
import { DictionaryIcon, LogOutIcon, UserIcon } from "../Common/Icons";

import "./Header.scss";

const LazyLogin = lazy(() => import("../Modals/LoginModal"));
const LazySignup = lazy(() => import("../Modals/SignupModal"));

const Header = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [modalAuthShow, setModalAuthShow] = useState(false);
  const [modalRegistrationShow, setModalRegistrationShow] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const isMainPageRoute = useMatch("/");

  return (
    <header>
      <ul className="nav">
        <li>
          <Button
            linkTo="/dictionary"
            disabled={!isAuthenticated}
            btnType="bubble"
            bubbleCount={user.words_in_progress}
          >
            <DictionaryIcon />
          </Button>
        </li>
        <li>
          {isMainPageRoute ? (
            <p className="nav--logo">WCA</p>
          ) : (
            <Link className="nav--logo" to="/">
              WCA
            </Link>
          )}
        </li>
        <li>
          {!isAuthenticated ? (
            <Button
              onClick={() => {
                setModalAuthShow(true);
                setExpanded(false);
              }}
            >
              <UserIcon />
            </Button>
          ) : (
            <Button
              onClick={() => {
                logout();
                setExpanded(false);
              }}
              btnType="icon"
            >
              <LogOutIcon />
            </Button>
          )}
        </li>
      </ul>

      <Suspense fallback={<span>Loading...</span>}>
        {modalRegistrationShow && (
          <LazySignup
            show={modalRegistrationShow}
            onHide={() => setModalRegistrationShow(false)}
            onLogin={() => {
              setModalRegistrationShow(false);
              setModalAuthShow(true);
            }}
          />
        )}

        {modalAuthShow && (
          <LazyLogin
            show={modalAuthShow}
            onHide={() => setModalAuthShow(false)}
            onRegistrationClick={() => {
              setModalRegistrationShow(true);
              setModalAuthShow(false);
            }}
          />
        )}
      </Suspense>
    </header>
  );
};

export default Header;
