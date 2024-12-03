// components/ImageSlider.js
import Image from 'next/image';

const ImageSlider = ({ images, currentIndex, setCurrentIndex, openModal, closeModal }) => {
    return (
        <div className="relative w-full mt-4 overflow-hidden">
            {images.map((img, index) => (
                <Image
                    key={index}
                    src={img}
                    alt={`House Image ${index + 1}`}
                    width={800}
                    height={300}
                    className="w-full h-full object-cover rounded cursor-pointer"
                    onClick={() => {
                        setCurrentIndex(index);
                        openModal();
                    }} 
                />
            ))}
            {/* Modal for viewing larger images */}
            {/* Include modal logic here */}
        </div>
    );
};
