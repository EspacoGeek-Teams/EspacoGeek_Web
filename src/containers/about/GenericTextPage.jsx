import React from "react";
import Layout from "../../components/layout/Layout";
import { useTranslation } from "react-i18next";
import PropTypes from 'prop-types';

export default function GenericTextPage({children}) {
    const { t } = useTranslation();

    return <Layout>
        <div className="flex justify-center items-center pt-16">
            <div className="w-3/4 bg-[--bg-second] h-3/4 rounded-lg p-10">
                {children}
            </div>
        </div>
    </Layout>
}

GenericTextPage.propTypes = {
    children: PropTypes.node
};
