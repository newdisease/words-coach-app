import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useMatch } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import logout from '../Auth/Logout';

import { DictionaryIcon, UserIcon, LogOutIcon } from '../Common/Icons';
import { Button } from '../Common';

import './Header.scss';

const LazyLogin = lazy(() => import('../Auth/LoginModal'));
const LazySignup = lazy(() => import('../Signup/SignupModal'));

const Header = () => {
    const { user, isAuthenticated } = useSelector(state => state.user);
    const [modalAuthShow, setModalAuthShow] = useState(false);
    const [modalRegistrationShow, setModalRegistrationShow] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const isMainPageRoute = useMatch('/');

    return (
        <header>
            <ul className='nav'>
                <li>
                    <Button
                        linkTo='/dictionary'
                        disabled={!isAuthenticated}
                        btnType='bubble'
                        bubbleCount={user.words_in_progress}
                    >
                        <DictionaryIcon />
                    </Button>
                </li>
                <li>
                    {
                        isMainPageRoute ?
                            <p className='nav--logo'>WCA</p> :
                            <Link className='nav--logo' to="/">WCA</Link>
                    }
                </li>
                <li>
                    {!isAuthenticated ?
                        <Button
                            onClick={() => {
                                setModalAuthShow(true);
                                setExpanded(false)
                            }}>
                            <UserIcon />
                        </Button> :
                        <Button
                            onClick={() => {
                                logout();
                                setExpanded(false)
                            }}
                            btnType='icon'
                        >
                            <LogOutIcon />
                        </Button>
                    }
                </li>
            </ul>

            <Suspense fallback={<span className="visually-hidden">Loading...</span>}>
                {
                    modalRegistrationShow && <LazySignup
                        show={modalRegistrationShow}
                        onHide={() => setModalRegistrationShow(false)}
                    />
                }

                {
                    modalAuthShow && <LazyLogin
                        show={modalAuthShow}
                        onHide={() => setModalAuthShow(false)}
                    />
                }
            </Suspense>
        </header >
    );
}

export default Header;