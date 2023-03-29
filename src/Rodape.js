import React from 'react';
import ReactTooltip from "react-tooltip";
import './App.css';
import 'bulma/css/bulma.css';
import PackageJson from '../package.json';

const Rodape = () => {
    return (
        <footer className="footer rodape is-minha-cor">
            <div className="content has-text-centered">
                <label className="has-text-white">
                    © 2023 Copyright: Desenvolvido por <a className="has-text-white" href="https://www.linkedin.com/in/marlonmazzine/" target="_blank" rel="noopener noreferrer" data-tip="Marlon Mazzine - LinkedIn" data-for="linkedin">Marlon Mazzine</a>, <a className="has-text-white" href="http://lattes.cnpq.br/3210678352782316" target="_blank" rel="noopener noreferrer" data-tip="Thais Figueiredo - Currículo Lattes" data-for="curriculo lattes">Thais Figueiredo</a> e <a className="has-text-white" href="http://lattes.cnpq.br/0591910045105134" target="_blank" rel="noopener noreferrer" data-tip="Thais Dias - Currículo Lattes" data-for="curriculo lattes">Thais Dias</a> | Versão: {PackageJson.version} | Dúvidas ou sugestões: marlonmazzine@gmail.com
                </label>
                <ReactTooltip effect="solid" place="top" id="linkedin" />
                <ReactTooltip effect="solid" place="top" id="curriculo lattes" />
            </div>
        </footer>
    );
}

export default Rodape;