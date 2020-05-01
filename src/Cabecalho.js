import React, { Component } from 'react';
import './App.css';
import 'bulma/css/bulma.css';

class Header extends Component {
    render() {
        return (
            <header>
                <div className="cabecalho is-minha-cor">
                    <h1 className="has-text-white is-size-4 is-uppercase has-text-weight-bold is-family-sans-serif"
                        dangerouslySetInnerHTML={{ __html: "Calculadora SOS<br>em Pediatria" }}></h1>
                </div>
                <div className="triangulo"></div>
            </header>
        );
    }
}

export default Header;
