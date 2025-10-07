import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Home from "./../containers/home/Home";
import Media from "./../containers/media/Media";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<Home />} />
            <Route path="media/:mediaId/:mediaName" element={<Media />} />
        </>
    )
);

export default router;
