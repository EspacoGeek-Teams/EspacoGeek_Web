'use client'

import React, { useEffect, useState } from "react";
import GenericTextPage from "../../src/containers/about/GenericTextPage";
import axios from "axios";
import { useTranslation } from "react-i18next";
import AvatarFieldset from "../../src/components/fieldset/AvatarFieldset";
import { Button } from "primereact/button";

export default function AboutPage() {
    const [avatarURL, setAvatarURL] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        async function fetchAvatar() {
            const url = await getAvatarGitHubURL("vitorhugo-java");
            setAvatarURL([...avatarURL, {url}]);

            setLoading(false);
        }
        fetchAvatar();
    }, []);

    async function getAvatarGitHubURL(user) {
        const responseJSON = await axios.get(`https://api.github.com/users/${user}`);
        return responseJSON.data.avatar_url;
    }

    function contentFieldsetTeamTemplate(quote, about, role, links) {
        return <div className="flex flex-col">
            {quote && <div>
                <p className="italic text-sm">
                    {quote}
                </p>
            </div>}

            {about && <div>
                <p>{about}</p>
            </div>}

            {role && <div>
                <p><span>{t('about.responsibilities')}:</span> {role}</p>
            </div>}

            {links && <div>
                {links}
            </div>}
        </div>
    }

    function buildContentLinkTeamTemplate(linkJson) {
        if (!linkJson) return null;

        const entries = Array.isArray(linkJson)
            ? linkJson
            : Object.entries(linkJson).map(([, v]) => v);

        const items = entries.map((value) => {
            // If value is an object with a single nested value (e.g. {1: {icon, link}})
            if (value && typeof value === 'object' && !value.icon) {
                const inner = Object.values(value)[0];
                return inner || null;
            }
            return value;
        }).filter(Boolean);

        return <div className="flex flex-row gap-2">
            {items.map((item, idx) => (
                item && item.link ? (
                    <Button key={idx} icon={item.icon} onClick={() => window.open(item.link, '_blank')} rounded text />
                ) : null
            ))}
        </div>
    }

    return <GenericTextPage>
        <div className="flex flex-col gap-2">
            <div>
                <h2>{t('about.aboutUs')}</h2>
                <p className="text-justify">{t('about.description')}</p>
            </div>

            <div>
                <h2>{t('about.team')}</h2>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <AvatarFieldset
                            avatarURL={avatarURL[0]?.url}
                            loading={loading}
                            legend="Vitor Hugo">
                            {contentFieldsetTeamTemplate(
                                t('teamMemberVitorHugoJava.quote'),
                                t('teamMemberVitorHugoJava.about'),
                                t('teamMemberVitorHugoJava.role'),
                                buildContentLinkTeamTemplate([
                                    { 1: { icon: 'pi pi-github', link: 'https://github.com/vitorhugo-java' } },
                                    { 2: { icon: 'pi pi-linkedin', link: 'https://www.linkedin.com/in/hugo-java' } }
                                ]))}
                        </AvatarFieldset>
                    </div>

                    <div>
                        <AvatarFieldset
                            avatarURL={avatarURL[1]?.url}
                            loading={loading}
                            legend="Abigail">
                            {contentFieldsetTeamTemplate(
                                t('teamMemberAbigailASPNET.quote'),
                                t('teamMemberAbigailASPNET.about'),
                                t('teamMemberAbigailASPNET.role'),
                                buildContentLinkTeamTemplate([
                                    { 1: { icon: 'pi pi-github', link: 'https://github.com/AbigailGeovana' } },
                                    { 2: { icon: 'pi pi-linkedin', link: 'https://www.linkedin.com/in/abigail-geovana-0a6091240' } }
                                ]))}
                        </AvatarFieldset>
                    </div>
                </div>
            </div>
        </div>
    </GenericTextPage>;
}