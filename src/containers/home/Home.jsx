import React from "react";
import { Footer, TopBar } from "../../components/layout/Layout";
import { Image } from 'primereact/image';
import { GlobalLoadingContext } from "../../contexts/GlobalLoadingContext";
import quote from "../../components/apollo/schemas/queries/quoteArtwork";
import "./star.css";
import "./imageGradient.css";
import { useEffect, useContext } from "react";
import { useQuery } from '@apollo/client';

function Home() {
    const { loading, data } = useQuery(quote);
    const { setGlobalLoading } = useContext(GlobalLoadingContext);

    useEffect(() => {
        setGlobalLoading(loading);
        document.title = "Home - EspaçoGeek";
    }, [loading, setGlobalLoading]);

    return (
        <>
            <TopBar />
            <div className="z-0 bg-animation absolute opacity-90">
                <div id="stars"></div>
                <div id="stars2"></div>
                <div id="stars3"></div>
                <div id="stars4"></div>
            </div>
            <div className="z-0 w-screen h-screen flex flex-col justify-center items-center">
                <div className="w-1/2 pb-96">
                    <h1 className="animate-bounce text-4xl font-bold text-center">Welcome to EspaçoGeek!</h1>
                    <p className="text-center">Your ultimate hobby tracker for movies, series, anime, and games!</p>
                </div>
            </div>
            <div className="absolute top-0 left-0 w-screen h-screen">
                <Image src={data?.quote?.urlArtwork} className="-z-10 image-gradient fill-viewport" />
                <div className="absolute bottom-0 left-0 m-8 p-8 w-80 md:w-6/12">
                    <p className="text-left italic">{data?.quote?.quote} - {data?.quote?.author}</p>
                </div>
            </div>
            <div>
                <Footer />
            </div>
        </>
    );
}

export default Home;
