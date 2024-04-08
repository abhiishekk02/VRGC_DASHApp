import { useState } from 'react';

export default function ImageValidator() {
    const [imageUrl, setImageUrl] = useState('');
    const [isValid, setIsValid] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    let timeoutId;

    const validateImageUrl = () => {
        setIsLoading(true);
        timeoutId && clearTimeout(timeoutId);
        timeoutId = setTimeout(() => setIsValid(false), 5000);

        const img = new Image();
        img.onload = () => { setIsValid(true); setIsLoading(false); clearTimeout(timeoutId); };
        img.onerror = () => { setIsValid(false); setIsLoading(false); clearTimeout(timeoutId); };
        img.src = imageUrl;
    };

    const forceUpload = () => { setIsValid(true); setIsLoading(false); };

    return (
        <div>
            <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Enter image URL" />
            <button onClick={validateImageUrl}>Validate</button>
            <button onClick={forceUpload}>Force Upload</button>

            {isLoading && <p>Loading...</p>}
            {isValid !== null && <p>{isValid ? 'The URL points to an image.' : 'The URL does not point to an image.'}</p>}
        </div>
    );
}
