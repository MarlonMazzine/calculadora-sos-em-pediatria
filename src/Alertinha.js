import React from "react";
import './App.css';
import 'bulma/css/bulma.css';

const Alertinha = ({ erroEstado, fecharErro, mensagem }) => {
    if (!erroEstado) {
        return null;
    }

    return (
        <div className="modal is-active">
            <div className="modal-background" onClick={fecharErro} />
            <div className="modal-card">
                <div className="notification is-danger">
                    <button className="delete" onClick={fecharErro}></button>
                    {mensagem}
                </div>
            </div>
        </div>
    );
}
export default Alertinha;