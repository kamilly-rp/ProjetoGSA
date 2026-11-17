
import React, { useRef, useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import { getProperty } from '../../utils/api';
import { PuffLoader } from "react-spinners";
import { AiFillHeart } from 'react-icons/ai';
import './Property.css';
import './PropertyLightbox.css';

import { FaShower } from "react-icons/fa";
import { AiTwotoneCar } from "react-icons/ai";

import { MdLocationPin, MdMeetingRoom } from "react-icons/md";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRulerCombined } from '@fortawesome/free-solid-svg-icons';

const Property = () => {
  const { pathname } = useLocation();
  const id = pathname.split("/").slice(-1)[0];

  const scrollRef = useRef(null);

  // Estado do Lightbox
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const { data, isLoading, isError } = useQuery(
    ["resd", id],
    () => getProperty(id)
  );

  // Lista de imagens, sem vídeos e sem duplicações
  const galleryImages = [
    ...new Set([
      data?.image,
      ...(Array.isArray(data?.carrossel)
        ? data.carrossel.filter(
            url =>
              typeof url === "string" &&
              !url.toLowerCase().split("?")[0].endsWith(".mp4")
          )
        : [])
    ].filter(url => typeof url === "string" && url.length > 0))
  ];

  // Navegação original do carrossel
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  // Abrir imagem
  const openLightbox = (imageUrl) => {
    const index = galleryImages.indexOf(imageUrl);

    if (index !== -1) {
      setSelectedImageIndex(index);
    }
  };

  // Fechar imagem
  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  // Próxima imagem
  const nextImage = (e) => {
    e.stopPropagation();

    setSelectedImageIndex(prev =>
      (prev + 1) % galleryImages.length
    );
  };

  // Imagem anterior
  const prevImage = (e) => {
    e.stopPropagation();

    setSelectedImageIndex(prev =>
      (prev - 1 + galleryImages.length) % galleryImages.length
    );
  };

  // Navegação pelo teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImageIndex === null) return;

      if (e.key === "Escape") {
        closeLightbox();
      }

      if (e.key === "ArrowRight") {
        setSelectedImageIndex(prev =>
          (prev + 1) % galleryImages.length
        );
      }

      if (e.key === "ArrowLeft") {
        setSelectedImageIndex(prev =>
          (prev - 1 + galleryImages.length) % galleryImages.length
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImageIndex, galleryImages.length]);

  if (isLoading) {
    return (
      <div className="wrapper">
        <div className="flexCenter paddings">
          <PuffLoader />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="wrapper">
        <div className="flexCenter paddings">
          <span>Error while fetching the property details</span>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="flexColStart paddings innerWidth property-container">

        {/* Like button */}
        <div className="like">
          <AiFillHeart size={24} color="white" />
        </div>

        {/* Código do imóvel */}
        <div style={{
          marginTop: '0.1rem',
          fontWeight: '400',
          color: 'gray'
        }}>
          Código: {data?.code}
        </div>

        {/* Imagem principal */}
        <img
          src={data?.image}
          alt="home image"
          onClick={() => openLightbox(data?.image)}
          style={{ cursor: 'pointer' }}
        />

        {/* Galeria com botões de navegação */}
        <div style={{
          position: 'relative',
          width: '100%',
          marginTop: '1rem'
        }}>

          <button
            onClick={scrollLeft}
            className="r-prevButton"
            style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.8)',
              border: 'none',
              borderRadius: '50%',
              width: 30,
              height: 30,
            }}
          >
            &#10094;
          </button>

          <button
            onClick={scrollRight}
            className="r-nextButton"
            style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.8)',
              border: 'none',
              borderRadius: '50%',
              width: 30,
              height: 30,
            }}
          >
            &#10095;
          </button>

          <div
            className="image-scroll-container"
            ref={scrollRef}
            style={{
              display: 'flex',
              gap: '10px',
              overflowX: 'auto',
              padding: '10px 40px',
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >

            {/* Esconde scrollbar no Chrome, Edge e Safari */}
            <style>{`
              .image-scroll-container::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {/* Imagens e vídeos originais */}
            {data?.carrossel?.map((imgUrl, index) =>
              imgUrl.toLowerCase().split("?")[0].endsWith(".mp4") ? (
                <video
                  key={index}
                  controls
                  className="scroll-video"
                  style={{
                    height: "220px",
                    borderRadius: "8px",
                    flexShrink: 0
                  }}
                >
                  <source src={imgUrl} type="video/mp4" />
                  Seu navegador não suporta o vídeo.
                </video>
              ) : (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`property image ${index + 1}`}
                  className="scroll-image"
                  style={{
                    height: "220px",
                    cursor: "pointer",
                    borderRadius: "8px",
                    flexShrink: 0
                  }}
                  onClick={() => openLightbox(imgUrl)}
                />
              )
            )}

          </div>
        </div>

        {/* LIGHTBOX */}
        {selectedImageIndex !== null && (
          <div
            className="image-lightbox"
            onClick={closeLightbox}
          >

            {/* Fechar */}
            <button
              className="lightbox-close"
              onClick={closeLightbox}
              aria-label="Fechar imagem"
            >
              &times;
            </button>

            {/* Imagem anterior */}
            {galleryImages.length > 1 && (
              <button
                className="lightbox-prev"
                onClick={prevImage}
                aria-label="Imagem anterior"
              >
                &#10094;
              </button>
            )}

            {/* Imagem ampliada */}
            <img
              src={galleryImages[selectedImageIndex]}
              alt={`Imagem ${selectedImageIndex + 1} do imóvel`}
              className="lightbox-image"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Próxima imagem */}
            {galleryImages.length > 1 && (
              <button
                className="lightbox-next"
                onClick={nextImage}
                aria-label="Próxima imagem"
              >
                &#10095;
              </button>
            )}

            {/* Contador */}
            <span className="lightbox-counter">
              {selectedImageIndex + 1} / {galleryImages.length}
            </span>

          </div>
        )}

        {/* Informações financeiras */}
        <div className="financial-info" style={{
          backgroundColor: "#f5f5f5",
          padding: "1rem",
          borderRadius: "8px",
          marginTop: "1rem",
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap"
        }}>

          <span className="secondaryText">
            <strong>Aceita Financiamento:</strong> {data?.financing || 'Não informado'}
          </span>

          <span className="secondaryText">
            <strong>IPTU:</strong>
            {data?.iptu == null
              ? "Não informado"
              : ` R$ ${Number(data.iptu).toLocaleString('pt-BR')}`}
          </span>

          <span className="secondaryText">
            <strong>Entrada:</strong>
            {data?.downPayment == null
              ? "Não informado"
              : ` R$ ${Number(data.downPayment).toLocaleString('pt-BR')}`}
          </span>

        </div>

        {/* Detalhes do imóvel */}
        <div className="flexCenter property-details">

          <div className="flexColStart left">

            {/* Título e preço */}
            <div className="flexStart head">

              <span className="primaryText">
                {data?.title}
              </span>

              <span className="orangeText" style={{ fontSize: '1.5rem' }}>
                R$ {Number(data?.price || 0).toLocaleString(
                  'pt-BR',
                  { minimumFractionDigits: 0 }
                )}
              </span>

            </div>

            {/* Características */}
            <div className="flexStart facilities">

              <div className="flexStart facility">
                <FaShower size={20} color="#1F3E72" />
                <span>{data?.facilities?.bathrooms} BANHEIROS</span>
              </div>

              <div className="flexStart facility">
                <AiTwotoneCar size={20} color="#1F3E72" />
                <span>{data?.facilities?.garage} GARAGEM</span>
              </div>

              <div className="flexStart facility">
                <MdMeetingRoom size={20} color="#1F3E72" />
                <span>{data?.facilities?.bedrooms} QUARTOS</span>
              </div>

              <div className="flexStart facility">
                <FontAwesomeIcon
                  icon={faRulerCombined}
                  size="lg"
                  color="#1F3E72"
                />
                <span>{data?.facilities?.area} ÁREA CONSTRUÍDA</span>
              </div>

            </div>

            {/* Descrição */}
            <span className="secondaryText" style={{ textAlign: "justify" }}>
              {data?.description}
            </span>

            {/* Endereço */}
            <div className="flexStart" style={{ gap: "1rem" }}>
              <MdLocationPin size={25} />

              <span className="secondaryText">
                {data?.address} {data?.city} {data?.country}
              </span>
            </div>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/551130422831?text=${encodeURIComponent(
                `(Por gentileza, não edite essa mensagem, desta maneira nossa equipe poderá atendê-lo de uma maneira mais dinâmica)
                  \nOlá, vim pelo site. Tenho interesse no imóvel "${data?.title}", código ${data?.code}.\n ${data?.image} \n Poderia me passar mais informações?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="button"
              style={{
                textDecoration: 'none',
                display: 'inline-block',
                textAlign: 'center'
              }}
            >
              Entre em contato
            </a>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Property;
