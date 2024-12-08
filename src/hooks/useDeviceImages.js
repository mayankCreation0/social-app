// src/hooks/useDeviceImages.js
import { useState, useEffect } from 'react';

export const useDeviceImages = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadDeviceImages = () => {
        try {
            // Mock data to simulate device gallery images
            const mockImages = [
                { id: '1', url: 'https://s3-alpha-sig.figma.com/img/3266/ee28/2707ba21eb516eb0975e8addee9028f1?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=jP4eSfU6xeR1mWYjwcuPB3qNDST048nYrQZ3qBXxJA13jNN2Tbf4uAX0U6VZ1XH7sU4lgoxx0MFxHaERr3~-ErfPVja0WBUJPEO8-ChFWCk3sR612Qanl68Wc3kduOaisAHFo2yBFjU2OnSCChEU25AAHOxjoYfy9-Kdol2Gm4pCncM-D30URKMqpUML8XrahpQkWtrCj1E~iYnxYhMGtSFEVCVx64I-jSNw8XG8BaqM3YXfng4T-uRbCCXM8gTI-LxkJXdaAukN~yXq1KXQre0YL~kDAREng2t7jBxedfBDn2akhPhjIIaMUW0Rz8Q2eC1uXYAeAMRfcQXkel-Taw__' },
                { id: '2', url: 'https://s3-alpha-sig.figma.com/img/f232/1631/11f24651a558198ebec04e0b6ed7c846?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=V4DelQWsCMrpjey2O7uCajkW-QBc6K2PMQX4lYaQrQF5DGBzse~XtWZo4SYlCH2wQsdBBTDmBEyC-MJvzPVctIr042IX0oqhRbpmt3yHvc3nHyEZ-5IlM7ZI9hHiR8gIJI9zWIB6Cowtk8WGCRx87Idx9SWo3TmoER8yBZdlGwZ4PqMridblAi84g6Vr3i1OiSSZL0yKeOaQ7152mdQKmwColPeGhf9~Sf6zQ5pS9cyl77SJS18pGp1ciLzcDgr897OU9eVdqpLKByKRDR1~Iypqcr5jNtoxpYzf3bjKZBYGq7ImUwxgaCjAW~mUuGUPcPoopDDU3iZrBL5JAKdzag__' },
                { id: '3', url: 'https://s3-alpha-sig.figma.com/img/8945/7034/8cd9b8d06f6f165ce053b0829c08e1c5?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NFR3MOqG3AlVgVm76I18LUUSwKiccdEByXU6jXh~6fLjcSsYtRlKTUwHDwqFW9eFdJFp5KUCziNrQ6KJCMBPMxgLe-MKH2puDvBaOUo2QugDiLzp5CtTWgCYvRNxSwDnkWquf-KwqZHRF9q6oaTajEC1BVlO7MOkDrxd-qb-nPG1W-q4dVlJiGCFTtAmVMVxe0Uu52U8F9k26XgK0eSkp-J76jNaCc3nbKMbcN-~U8gGTM1JMAQnzERAWQ6dsQHYgBU5TBzChXktopnPHctNZbZQcDvq4tDldM5OUOJKLC1l-Noj7jmvx95JzR3IUmkfLvjmIJEQWlRFvoBJ2sc5FA__' },
                { id: '4', url: 'https://s3-alpha-sig.figma.com/img/42ab/47bd/e7c76267087ee472245a6de8e9f9cc9d?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=aNJMpp274D0~Fybq-VWecougj7x31Nm0GZPap2Eq0b2LaMVZE1wJMfre6MWZjhgX-WiDZp57mDEFMtT0PgC77PqB62ZaL3N80iL0h1qLxBP4YNWvBqASopLNGruuH2-CuxG7RKi4AJ~lU39E-zf2uCp4S5L-c~-12~DLNPuslKisoRnSpcbz~dvyDKNPypIFA3yONnePhJzbhk~9-D6gu102cDJw-pk21oHeG1Sc1JT0KzdGv5-gkvPaDauxd9KH-GCdtrd3FhR234VvazBmEzQeh8jbDRnpkpmW5wV9O0Sp6e~JYROIqX0vwbFqQRXSdICTNxcnGR-hYGTM-~WPYA__' },
                { id: '5', url: 'https://s3-alpha-sig.figma.com/img/8009/0720/34720cc1c465d2859dc7ee3eeb802cb2?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=OzZPmY-6yBi38M-juqcD112OtMLqaRFZF8EXu68faMHV1ZKDaTMBVZM4I1b5auPxVyYy9QkWp7~JeR0SyFvNUI9Z-gkvbtY6mlRu-0uDRj5gGM8DWsi2Tsoko3arA4bW5Q6Supad8FyGsHGR6hVlAvam5L8P~0taUrklZIjed4Fpk5gXvn3NhmAWbN1zZsGZT1C8mNMBEwPgeTFhRwDkdevRaWgeXWnzJ4P9VGF4h91gHos~JdH7kOIsihA62dQUZBeeNU3o6AhOAIy~XgU0ndAa74yr3pzNuEqLvnI-aYGd2QbaXPfgvlfAOCPMzXvFe0ftl40qmNfGsk6TYfJ8pQ__' },
                { id: '6', url: 'https://s3-alpha-sig.figma.com/img/a339/ac25/3257c0bd70086ef09f07437a3a01453b?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oSFhzfI3BQJY2VLKw5EOnVRa3RrH2m~pg7gCLhkqA7odaVEPe5CKRh07~v0M2hfxWTX7HKw6U0GaczIUoiy8rhPmCy0yMFd0Zlv1u-og2LzSjnBG7fZ2VbI2URfH4gKedHL3KFgi-3LHLjNkZvKRV7zCYjc1iQuDc6GWsawNR5fvW68vSu9ixfOtD4uHAHnp8T4T3Mw2TFFoJc6m~9fu~nlYckeIiMj00LObDpA5jHo3k~XuH8lnaRJKpjjAvBVNsWdTGOi-bPRza7Mb75dfnHXS4PFTMTrmC5UE6Cn80nacB1FO9-cdFNfoebIswzU8d7-DN2pQ4TBO~~sSKcVOGQ__' },
                { id: '7', url: 'https://s3-alpha-sig.figma.com/img/0c14/2a8c/9e46b5971f637c356cc7f3a4c0f6f63a?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=CBUO2DYCiqhBpTIjX8hi4m-t5gQxOFKLE1mKkED1YHzymLn9jlmZL57opP2kaHUaMfgPV0vGmN4Fc998~wTdFTLizk8CjPMxZ3tH2207-XS96Mzki7MYrR4stPOlGJ09RF5rN63I~cnUHDUuEce~CR1o2wFn36QH6Itqbo2kKjbKsRlJqw9Bi-BQtJYMsIdnor2b9i4Z3MXrneGeHTT6-07sdqwqb4nY8bvvGmHETj19PDkfdNs9utBnUE9e8xGlMFzvzSdDkyzeXq~nCrLofKGaqrCO8NHs~QOWNOvQL5y00TrixSTsfPmYTKm6oq-ccysSGx9fk5x10VXiYQXlrA__' },
                { id: '8', url: 'https://s3-alpha-sig.figma.com/img/124f/c782/561ea826dba01d957b177fb07e6bc3e6?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=JWAhRHEwXBaTHRustCBUXBimxjw6o0-fKoxm-DpDSZjJn~YopOzxD9LVJ86U9ei8EgDVEi2E15yMqKr5QYU5WEm-ZgBwwrGk5Qi222Hhee3ZCxSku3euzJXn-3xU3X9ZFnBt8DMxCl9KgLrHRrOdLqUL4KMsqRyUOT1qFKOKKD83YQ7ZQer~r8pJ5S5QEasjQvD08d7vDdAgyk2VVgTdBEPk16wgfurGPf~E1zYGy60tJTGE-TjTTy6umRgXHJafvcnY29r2EcdG65f5XBdyktgQarKwUaLSKVT8AU08eWJ~WaxWs655afr03micxy7F3hnTK9ItQupIKqN7KTKWCg__' },

            ];

            // Set images from mock data (this can be replaced with real data if possible)
            setImages(mockImages);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDeviceImages(); // Automatically load images on hook mount
    }, []);

    return { images, loading, error, loadDeviceImages };
};
