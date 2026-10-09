import Head from 'next/head'
import { WeddingLanding } from '../src/components/WeddingLanding'

export default function Home() {
	return (
		<>
			<Head>
				<title>Jamila&Bruno | Nosso Casamento</title>
				<meta name="description" content="Site de casamento dos noivos J&B." />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<WeddingLanding />
		</>
	)
}
