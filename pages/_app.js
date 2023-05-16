import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import OurTeam from "../components/Team";
import About from "../components/About";
import DocApp from "../components/docApp";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import {
	mainnet,
	polygon,
	optimism,
	arbitrum,
	goerli,
	polygonMumbai,
	optimismGoerli,
	arbitrumGoerli,
} from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import MainLayout from "../layout/mainLayout";

const { chains, provider } = configureChains(
	[
		mainnet,
		goerli,
		polygon,
		polygonMumbai,
		optimism,
		optimismGoerli,
		arbitrum,
		arbitrumGoerli,
	],
	[publicProvider({ apiKey: process.env.ALCHEMY_API_KEY }), publicProvider()]
);

const { connectors } = getDefaultWallets({
	appName: "My Alchemy DApp",
	chains,
});

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider,
});

export { WagmiConfig, RainbowKitProvider };
function MyApp({ Component, pageProps }) {
	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider
				modalSize="compact"
				initialChain={process.env.NEXT_PUBLIC_DEFAULT_CHAIN}
				chains={chains}
			>
				<MainLayout>
				<section id="docapp" className={`section-with-border `}>
            <Component {...pageProps} /> 
          </section>
					
					<section id="docapp" className={`section-with-border `}>
            <DocApp />
          </section>
					<section id="about" className={`section-with-border `}>
            <About />
          </section>
					<section id="team" className={`section-with-border `}>
            <OurTeam />
          </section>

				</MainLayout>
				
			</RainbowKitProvider>
		</WagmiConfig>
	);
}

export default MyApp;
