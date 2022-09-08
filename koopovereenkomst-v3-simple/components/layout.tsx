import { SessionProvider } from "@inrupt/solid-ui-react";
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import utilStyles from '../styles/utils.module.css';
import styles from '../styles/layout.module.css';

const name = 'Kadaster';
export const siteTitle = 'Koopovereenkomst Solid App';

export default function Layout({ children, home, role }: {
    children: React.ReactNode,
    home?: boolean,
    role?: string,
}) {
    return (
        <div className={[styles.container, role].join(" ")}>
            <SessionProvider>

                <Head>
                    <link rel="icon" href="/favicon.ico" />
                    <meta
                        name="description"
                        content="Learn how to build a personal website using Next.js"
                    />
                    <meta
                        property="og:image"
                        content={`https://og-image.vercel.app/${encodeURI(
                            siteTitle,
                        )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
                    />
                    <meta name="og:title" content={siteTitle} />
                    <meta name="twitter:card" content="summary_large_image" />
                </Head>
                <header className={styles.header}>
                    {home ? (
                        <>
                            <Image
                                priority
                                src="/images/kadaster.svg"
                                className={utilStyles.borderCircle}
                                height={144}
                                width={144}
                                alt={name}
                            />
                            <h1 className={utilStyles.heading2Xl}>{name}</h1>
                        </>
                    ) : (
                        <>
                            <Link href="/">
                                <a>
                                    <Image
                                        priority
                                        src="/images/kadaster.svg"
                                        className={utilStyles.borderCircle}
                                        height={108}
                                        width={108}
                                        alt={name}
                                    />
                                </a>
                            </Link>
                            <h2 className={utilStyles.headingLg}>
                                <Link href="/">
                                    <a className={utilStyles.colorInherit}>{name}</a>
                                </Link>
                            </h2>
                        </>
                    )}
                </header>
                <main>{children}</main>
                {!home && (
                    <div className={styles.backToHome}>
                        <Link href="/">
                            <a>← Main home</a>
                        </Link>
                    </div>
                )}
                <footer className={styles.footer}>
                    <a href="https://kadaster.nl" target="_blank" rel="noopener noreferrer">
                        Powered by{" "}
                        <span className={styles.logo}>
                            <Image
                                src="/images/kadaster.svg"
                                alt="Kadaster Logo"
                                width={72}
                                height={16}
                            />
                        </span>
                    </a>
                </footer>

            </SessionProvider>
        </div>
    );
}