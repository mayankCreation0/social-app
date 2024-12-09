import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');

        try {
            const loadingToast = toast.loading('Signing in...');
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            toast.dismiss(loadingToast);
            toast.success(`Welcome back, ${user.displayName}!`);
            navigate('/feed');
        } catch (error) {
            toast.error(error.message || 'Failed to sign in');
            console.error('Google Sign-In Error:', error.message);
        }
    };

    const images = [
        'https://s3-alpha-sig.figma.com/img/934c/8eaa/07a6b9eb2a8babdea056a3a7b1fc147f?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=c577XLbSN8IiOOfnHT8RbRRJp8W7bDr7z1DesmWI4jct9VjjdaovCe8WxVT32-eTBSQ8-h93CPNjnTasHtx3JPBrij3wvGLeR4TKLT-HcJy-82wY2Czebj~KyjOXIwGPyHpQrh315ZjhbKH3-ojnIqr87su2YNEEM5swglarKP41aCeR2JTIf8EppcOaj4f6uc9YKMXhiZNWoVO7un3vtDLnSaBaSRFpjBVxYGh272z45lWHAfoCWtHZRweWknr2wfoLo-42O3YHBLotWii-hpZ-1SxoiZpI~2~bbVsfuFalK7LB~y8QXZrJI~SgAJS7gOcQbYroxgPKQ0e~ekYMRg__',
        'https://s3-alpha-sig.figma.com/img/d73e/2214/4044975f305ca70914a520476023fd6d?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=J7glYzfR06xNhnNoqFbfucZnO5su3r~yi2zOujsBTVLT8ogaMQOEqcllcBauZWA114aquYfttlGWK1KeNwc8L~uuTYo5Y7twQLyOjfqh~MuUHRhXoSN4eRNsEzz1SEpfmmAVaLykkC11SRin4AECBuwGs89AyORElVutHLz5wckYJxb9hyQgUD4vy43iCDwDeR-n2UGnQP~ZtRthnPnMdokwhj6QrFob0i5y~lKz0L53hSA3D43eFkim~Z98eW0XBGicOdnr5vpmWCuwz6mx0d5TN96O6QWzLf7iSBuyGIkcgrw4INmnS~RKPY~W2RFdjM6PQQFEe4ZcHeYWbMYyhw__',
        'https://s3-alpha-sig.figma.com/img/d105/932e/baf6a10056d518f2f660159c27891ae5?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=gLL-~DsbwXdDlcJgd~sAhh5w6vOk-dBBEmE8Fqq-6msI1cRuOU7DVywfp0Pwl~xtbTDKZlhvsG47Wi8Iqh5EkePNm70WRRYp5vaWQjwEl6cDlD7oUb3PjUsM0p7VlKsABzOTbSGL9KmJh20imkVDBxqZqROB3nvyx26BP~vAlJ9-nBmJWJs4lkLJJgwot3EeeRnz5zUowxas6~Gj7-9zav8Hb95OFTWY-nBXrgioXslso~F92vEnnuZzgfsKfDD0iGbz2woyVrsYDWOdnAlJhCsPb-xk2rJetbdlEIndd1~WlzMimp2aIka96-kcryZKKQsASKjy7PICgdvDgcPQYg__',
        'https://s3-alpha-sig.figma.com/img/8dab/37bf/4ad4fac55b77a66d226aa1156db5e423?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=eJMGyVRT1dNV6Vg8G8uLwPM2ZSDfAgYnwx6nOJXJZOu878Wex-CcADVKNr05L2zlIkml-HO0feaWILw0xt0g6rC0HP26ls6OFxNgwJYv8EIy-EgBiRvNXoyu5-KYgEI2YPUbnSouf-1IxBAFtoA32I6Gr3Zz21JQKEecHX6nmii0aAM58idydiMEH1RtrpNpb4FRXXNDFWxyC0cVwOJhN~gZHmhYoxFuCBVYgI46TTmZiHANFTIKGO80I~jixRia0fjhvBXnw96dZnlJNjXbLOARE-SNrLX3-3YquFoNYkp7BxoZuda0MImjN7Q3BHW8xLTwTnSf23cU8s6-tHDgBQ__',
        'https://s3-alpha-sig.figma.com/img/207b/1314/51e50ce0fbfb20da6e07033f69a9f3ea?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=cwAhzJ1B~hwoKSp3HNoqtgcXWjfhSYPMkObIQOVYFlMIF7t4BdMeQHoKmWg818yEethyLRXtb8t8MNlhV7KT9rmYaDTU1G9x0G0kTnY35-4XLYImC6CFUhZHpGM9ttU94t3ebSLF37P5oMSxy~LRVElxJm3vakjI9zZohlQtaNMJfjqWLBBZ3D2uMnT5vPGm8kcmEUUdnNJvXcnHAZaSiTkprcAseTcEw6QgVZVBlWrW37yT2xw9iXh-7Cvailr6hEXliJHQ0gZB~hlU7Ec4aVoHhbB1Fh0kL6EPWD4Eppm6tOXNQ9lcKmxQa9KdR28Zpf9HrMl-yLDF1SjKE9-RnQ__',
        'https://s3-alpha-sig.figma.com/img/6f23/0259/b80d2714580bb71cdcf2cf0a286abaf1?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=MBwm0wJPxlqEyGUCKfKqHSfsODX5e4sO3Py70c6Vj-sW8SKOda62g9SPME0ubO6VNWQWAcfinNP2YqRhhm5elfwffRX-PINbwQlWvP5gQ8ZKBDMAOYUib2E1aDBmN~Cl0mWAPUvlSxQrPtkyW86oS1W2eVUKLjWerI8UCsZqBrBRsGavAcTSjfJvLX2IDdcZc-7uDy~dTTpIEab8Fj109pyizhnUxCTnEjPnon6qDlK8iGbzlQbsf4YAG6OteSN4HOV02WGJNfj1dX3VI6RhQW5FRVxWvk32O8Vxtnz~9pi7j51e5Ow2yQzysyHYCVLV57sBhwbJc6LWZ5Wplt2vlw__',
        'https://s3-alpha-sig.figma.com/img/43a1/be88/fe922fec80f9bd747fbe931d0ac5bcdc?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=hQNKqdN3djOleZR~FYyFV-JO9PD0rsDb5S9AOxAhBpOaXQB4PIJmf8akGauUhK9q5l7236GZ7Zh6qpzk9fpgHY0s2KYI9x3hky8EtRtdpM63gvI8SHI9PZodBpf~ai4-tyfiuT70p5qVa9QL-DNxhISIfMS2gSxan1ymXovPHC7DiQ7hdAIPGdfEgy0wtnzowGHPMCMSBeBBUC~98R3ARJiVNcUZ4V19FcmpLsQkR3tC0Bw4nX8x90kXBTXqhnTs4~t2VHa9EruNwb~UB5ZBaBIFHFH1pypl2QwUfFZ6tMjOy6~yZPTBN4iHx~8HHYjwvmi3Jwflqfcvl1dvoKn55A__',
        'https://s3-alpha-sig.figma.com/img/1d12/d5f5/034e1a60724e3533eb0244bb6ebd4d5c?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=SpS6vfwHcTlF-huIQi~yvGlyP-oUguFkqYOVov~Kt2klTYVpNfRm4YvterxFMbGgnmScxiTcpvhbRpa9P0wHr8EaUmcSoyJhKvS8j9HB8~y6HkMOHrxo1XM8AraA0uaWiCILYJaYhXTc47oOOrKQheLnkebWVPEb-nknGaQ3VZoscnwNiCgSUWM5R9N7SLfm-a2XdiZIHUrUhQp6326kKJbcPrbPCTK2qb8P0wVmnwS9lRIC6SwoTB3wUBHlsP3tqIFquoQOYU~DCNlE8YWv7l~6mKHwOqVyIXKN6fZwaTRgJcLQIM1XiHKCyiNQFF1ua5zdaSEH8DTqZ61nJlFB6A__',
        'https://s3-alpha-sig.figma.com/img/7ce7/facf/669dc0383b4fe8e47fdc768f7968602b?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LxjbRcNHM2pxEifW~JhT9IuPm~7Hob1~oDUHy6EwNAv~Ur-3dhcHV7k-4lbKarQCCc-UQSAV5MgYJxb1ofkJk9VYQ5kGanD8J2-Yf4MVxH9-bNH7Klp~k0D4EG6SEZkP8rJQRKd-2ddjyYDKBI8v9L7Gs1alsF6MskQuQsZHdvCjPni3FOHb-3ElqSlOU9Y-cpelLgmVd34aoMLSqrO8eWXW53IsPPFPnCOWlKSF2OSK06Zy6Chiwhyiu~nw2peuVAowTivx~PqYRr2tRiZCS6iAedA6jqUcI97KmOMcdvSxa8L3wEc9-QOnygaPDtQ3QV2s2CAnygpmfZt4a5LivQ__',
    ];

    return (
        <div className="relative w-full h-screen  mx-auto overflow-hidden bg-white">
            <div className="grid grid-cols-3 gap-1 w-full">
                {images.map((src, index) => (
                    <div
                        key={index}
                        className={`relative h-52 overflow-hidden ${(index + 1) % 3 === 2 ? '-translate-y-[30%]' : ''
                            }`}
                    >
                        <img
                            src={src}
                            alt={`Vibesnap ${index + 1}`}
                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                        />
                    </div>
                ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-[360px] bg-white rounded-t-[63px] shadow-2xl z-10">
                <div className="absolute top-9 left-[45%] -translate-x-1/2 flex items-center space-x-2">
                    <img
                        src="https://s3-alpha-sig.figma.com/img/e588/3ae0/261c0b95b3d799ea23271ef18084f911?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=q8FF409O~E-mxxOtNDdH1g05KowwPaZtZdeu5ohYIif7w~zqd0AuIx~2vOEXMLPAs8k~87fD5ghEQHckln1pHM2SVjOhK2cgHPtRV9WMTyMF8R5WJkYRrs7sAP71i5OhI4GKihhRYaGF1vtiijpTufrINuu49BFWwgVfjeX~M907JJjUPeeywyZslFjh323HLkUJ66GcK2UZhrdC3DyM332uQubQ0AWRGDgngjDO-QGNLS3jlxYt-Z88r1O2OSUbskJvHoxunoUA9dknQnxZCegBI3cBpmz6GJrnRmcHv4fEzAjjZXztrAgRqbL~jDiI61lVePEq8kvDzQ1MITYE-w__"
                        alt="Vibesnap"
                        className="w-14 h-14 object-contain"
                    />
                    <h1 className="font-karla text-2xl font-semibold leading-tight">
                        Vibesnap
                    </h1>
                </div>

                <p className="absolute top-28 left-1/2 -translate-x-1/2 w-full text-center font-kumbh text-base text-gray-600">
                    Moments That Matter, Shared Forever.
                </p>

                <button
                    onClick={handleGoogleSignIn}
                    className="absolute bottom-32 left-1/2 -translate-x-1/2 w-[60%] max-w-[280px] min-w-[200px] h-[50px] 
                             flex items-center justify-center gap-3.5 px-5 py-3.5
                             bg-[#292929] text-white rounded-[26px]
                             transition-transform hover:scale-[1.02] active:scale-[0.98]
                             shadow-lg hover:shadow-xl"
                >
                    <svg className="w-[18px] h-[18px]" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_1_312)">
                            <path d="M17.5818 9.1684C17.5818 8.43095 17.5219 7.8928 17.3924 7.33473H8.97144V10.6632H13.9144C13.8147 11.4904 13.2766 12.7361 12.0807 13.5732L12.0639 13.6846L14.7265 15.7473L14.911 15.7657C16.6051 14.201 17.5818 11.899 17.5818 9.1684Z" fill="#4285F4" />
                            <path d="M8.96944 17.9384C11.3911 17.9384 13.424 17.1411 14.909 15.7659L12.0787 13.5734C11.3213 14.1016 10.3048 14.4703 8.96944 14.4703C6.59763 14.4703 4.58458 12.9057 3.86699 10.7432L3.7618 10.7521L0.993237 12.8947L0.957031 12.9954C2.43193 15.9253 5.4615 17.9384 8.96944 17.9384Z" fill="#34A853" />
                            <path d="M3.86663 10.7429C3.67729 10.1848 3.56771 9.58686 3.56771 8.96902C3.56771 8.35111 3.67729 7.75319 3.85667 7.19512L3.85166 7.07627L1.0484 4.89923L0.956679 4.94286C0.348802 6.15868 0 7.524 0 8.96902C0 10.414 0.348802 11.7793 0.956679 12.9951L3.86663 10.7429Z" fill="#FBBC05" />
                            <path d="M8.96944 3.46802C10.6536 3.46802 11.7897 4.19551 12.4375 4.80346L14.9687 2.33196C13.4141 0.886947 11.3911 0 8.96944 0C5.4615 0 2.43193 2.01305 0.957031 4.94292L3.85702 7.19519C4.58458 5.03265 6.59763 3.46802 8.96944 3.46802Z" fill="#EB4335" />
                        </g>
                        <defs>
                            <clipPath id="clip0_1_312">
                                <rect width="17.5896" height="18" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                    <span className="font-kumbh text-base">Continue with Google</span>
                </button>
            </div>
        </div>
    );
};

export default LoginPage;