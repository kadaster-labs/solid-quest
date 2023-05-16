import NextImage from "next/image";

const customLoader = ({ src, width }) => {
  return `${src}?width=${width}`
}

export default function Image(props) {
  return (
    <NextImage
      {...props}
      loader={customLoader}
    />
  );
}