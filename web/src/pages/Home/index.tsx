import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import {FiLogIn} from 'react-icons/fi'

import CreatePoint from '../CreatePoint';
import './styles.css';

const Home = ()=>{ 
    return(
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="Ecoleta"/>
                </header>
                <main>
                    <h1>Seu marketplace de coleta de resíduos.</h1>
                    <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>
                    <Link to="/Create-Point">
                        <span>
                            <FiLogIn/>
                        </span>
                        <strong>Cadastre um ponto de coleta</strong>
                    </Link>
                </main>
            </div>
            <h1>Home</h1>

        </div>
    )
}

export default Home;