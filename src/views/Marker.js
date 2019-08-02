/**
 * Marker View using react-google-maps Component by @author [Tom Chent](https://github.com/tomchentw)
 *
 * @version 1.0.0
 * @author [Victor Ragojos](https://github.com/RagofJoes)
 */

import PropTypes from "prop-types";
import React, { useState } from "react";
import { Marker, InfoWindow } from "react-google-maps";

/**
 *   Figure Custom Marker View Component
 *
 *   @see See [Wikipedia](https://tomchentw.github.io/react-google-maps/) for a list of different props
 */
const CustomMarker = React.memo(props => {
    // Retrieve props
    const {
        lat,
        lng,
        text,
        images,
        mapRef,
        isFocused,
        isClickable,
        hasInfoWindow,
        changeMapCenter,
        hasScrollEffect,
        hasInfoWindowOpen,
        toggleInfoWindow,
        infoWindowComponent
    } = props;

    const [infoWindow, openInfoWindow] = useState(false);

    const closeInfoWindow = () => {
        toggleInfoWindow();
        openInfoWindow(false);
    };

    // Retrieve MapRef DOM Node from Redux
    return (
        <Marker
            key={text}
            icon={{
                url: isFocused ? images.on : images.off
            }}
            // animation={2}
            clickable={isClickable}
            position={{ lat, lng }}
            zIndex={isFocused ? 2 : 1}
            // Check if clicked marker is the same as mapCenter
            // opacity={isClickable && isFocused ? 1 : 0.6}
            opacity={
                hasInfoWindow
                    ? infoWindow
                        ? 0
                        : 1
                    : isClickable && isFocused
                    ? 1
                    : 0.6
            }
            onClick={mouseEvent => {
                // Pan to given Lat and Long coord if mapMarker is clickable
                if (isClickable) {
                    // Retrieve Lat and Long from Google Maps API event
                    const lat = mouseEvent.latLng.lat();
                    const lng = mouseEvent.latLng.lng();

                    // Toggles Info Window
                    if (hasInfoWindow && !hasInfoWindowOpen && !infoWindow) {
                        toggleInfoWindow(true);
                        openInfoWindow(true);
                    }

                    if (hasScrollEffect) {
                        mapRef.panTo({ lat, lng });

                        // Change Map Center for checking if marker isFocused
                        changeMapCenter(lat, lng);
                        document
                            .getElementsByClassName(`${text}`)[0]
                            .scrollIntoView();
                    }
                }
            }}
        >
            {hasInfoWindow && infoWindow ? (
                <InfoWindow onCloseClick={() => closeInfoWindow()}>
                    {infoWindowComponent}
                </InfoWindow>
            ) : null}
        </Marker>
    );
});

CustomMarker.propTypes = {
    /**
     * @param {float} lat for latitude
     * @param {flaot} lng for longtitude
     */
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,

    /**
     * @param {string} customIconImage for a custom icon image(recommend an SVG)
     */
    customIconImage: PropTypes.string,

    /**
     * @param {boolean} isClickable for determining whether marker is clickable for centering and zooming effects
     * @param {boolean} isFocused for centering and zooming effects
     */
    isClickable: PropTypes.bool,
    isFocused: PropTypes.bool
};

export default CustomMarker;
