import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import Home from "./../containers/home/Home";
import Media from "./../containers/media/Media";
import { AuthContext } from "../contexts/AuthContext";
import { ErrorContext } from "../contexts/ErrorContext";

export function RequireAuth({ children }) {
    return (
        <AuthContext.Consumer>
            {({ accessToken, openLogin }) => (
                accessToken ? children : <RedirectToHome openLogin={openLogin} />
            )}
        </AuthContext.Consumer>
    );
}

RequireAuth.propTypes = { children: PropTypes.node };

export function RedirectToHome({ openLogin }) {
    return (
        <ErrorContext.Consumer>
            {({ showError }) => {
                showError("Faça login para continuar.");
                openLogin();
                return <Navigate to="/" replace />;
            }}
        </ErrorContext.Consumer>
    );
}

RedirectToHome.propTypes = { openLogin: PropTypes.func };

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<Home />} />
            <Route path="media/:mediaId/:mediaName" element={<Media />} />
            { /* exemplo de rota protegida: */ }
            { /* <Route path="/minha-conta" element={<RequireAuth><MinhaConta /></RequireAuth>} /> */ }
        </>
    )
);

export default router;
