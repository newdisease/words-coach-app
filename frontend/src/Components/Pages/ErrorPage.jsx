import { useNavigate } from 'react-router-dom';
import { Button } from '../Common';
import errorImg from '../../Images/img404.svg'
import './ErrorPage.scss';


const ErrorPage = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className='tac'>
                <img className='error-img' src={errorImg} alt="error 404" />
                <h1 className='error-title'>Error 404</h1>
                <p className='error-text'>page not found</p>
            </div>
            <div className='tac'>
                <Button
                    onClick={() => navigate('/')}
                    btnType="lg"
                    raised >
                    Go to Mainpage
                </Button>
            </div>
        </>
    )
}

export default ErrorPage;
