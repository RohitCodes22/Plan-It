import { useState } from 'react';

export default function PhotoUpload({ onChange, multiple = false }) {
  const [previews, setPreviews] = useState([]);

  function handleFileChange(e) {
    const files = Array.from(e.target.files);
    setPreviews(files.map(file => URL.createObjectURL(file)));
    onChange?.(files);
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileChange}
        className='p-2 rounded border border-grey'
      />

      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        {previews.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            style={{ width: 100, height: 100, objectFit: 'cover' }}
          />
        ))}
      </div>
    </div>
  );
}