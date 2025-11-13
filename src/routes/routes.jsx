import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import Home from "../containers/home/Home";
import Media from "../containers/media/Media";
import { AuthContext } from "../contexts/AuthContext";

export function RequireAuth({ children }) {
    return (
        <AuthContext.Consumer>
            {({ isAuthenticated, initializing }) => (
                initializing ? null : (isAuthenticated ? children : <RedirectToHome />)
            )}
        </AuthContext.Consumer>
    );
}

RequireAuth.propTypes = { children: PropTypes.node };

export function RedirectToHome() {
    return <Navigate to="/" replace />;
}

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
