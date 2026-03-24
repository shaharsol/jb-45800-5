import Followers from '../followers/Followers'
import Following from '../following/Following'
import Footer from '../footer/Footer'
import Header from '../header/Header'
import Main from '../main/Main'
import './Layout.css'

export default function Layout() {
    return (
        <div className='Layout'>
            <header>
                <Header />
            </header>

            <aside id="following">
                <Following />
            </aside>

            <aside id="followers">
                <Followers />
            </aside>

            <main>
                <Main />
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    )
}