/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-sync-scripts */
import React, { useRef, useState, FunctionComponent } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import GoogleMapReact from "google-map-react";
import MarkerClusterer from "@googlemaps/markerclustererplus";
import { FaMapMarkerAlt } from "react-icons/fa";
import Supercluster, { AnyProps, PointFeature } from "supercluster";
import { BBox, GeoJsonProperties } from "geojson";
import useSupercluster from "use-supercluster";

const locations = [
  {
    lat: -31.56391,
    lng: 147.154312,
  },
  {
    lat: -33.718234,
    lng: 150.363181,
  },
  {
    lat: -33.727111,
    lng: 150.371124,
  },
  {
    lat: -33.848588,
    lng: 151.209834,
  },
  {
    lat: -33.851702,
    lng: 151.216968,
  },
  {
    lat: -34.671264,
    lng: 150.863657,
  },
  {
    lat: -35.304724,
    lng: 148.662905,
  },
  {
    lat: -36.817685,
    lng: 175.699196,
  },
  {
    lat: -36.828611,
    lng: 175.790222,
  },
  {
    lat: -37.75,
    lng: 145.116667,
  },
  {
    lat: -37.759859,
    lng: 145.128708,
  },
  {
    lat: -37.765015,
    lng: 145.133858,
  },
  {
    lat: -37.770104,
    lng: 145.143299,
  },
  {
    lat: -37.7737,
    lng: 145.145187,
  },
  {
    lat: -37.774785,
    lng: 145.137978,
  },
  {
    lat: -37.819616,
    lng: 144.968119,
  },
  {
    lat: -38.330766,
    lng: 144.695692,
  },
  {
    lat: -39.927193,
    lng: 175.053218,
  },
  {
    lat: -41.330162,
    lng: 174.865694,
  },
  {
    lat: -42.734358,
    lng: 147.439506,
  },
  {
    lat: -42.734358,
    lng: 147.501315,
  },
  {
    lat: -42.735258,
    lng: 147.438,
  },
  {
    lat: -43.999792,
    lng: 170.463352,
  },
];

const Home: NextPage = () => {
  // Create an array of alphabetical characters used to label the markers.
  const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  // Add some markers to the map.
  // Note: The code uses the JavaScript Array.prototype.map() method to
  // create an array of markers based on a given "locations" array.
  // The map() method here has nothing to do with the Google Maps API.

  /*
  const markers = locations.map((location, i) => {
    return new google.maps.Marker({
      position: location,
      label: labels[i % labels.length],
    });
  });

  const markerCluster = new MarkerClusterer(map, markers, {
    imagePath: "../images/m1.png",
  });

  */

  //map setup
  const mapRef = useRef();
  const [zoom, setZoom] = useState(4);
  const [bounds, setBounds] = useState<any>([]);

  //load locations
  interface MarkerProps {
    lat?: any;
    lng?: any;
  }

  const Marker: FunctionComponent<MarkerProps> = ({ children }) => (
    <> {children} </>
  );

  //create a geoJSON feature object
  const points: Array<PointFeature<GeoJsonProperties>> = locations.map(
    (point, index) => ({
      type: "Feature",
      properties: {
        cluster: false,
        clusterId: index,
        category: "cluster category",
      },
      geometry: { type: "Point", coordinates: [point.lng, point.lat] },
    })
  );

  //get the cluster
  const markerClusters = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 },
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Google Cluster Demo</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Google map starts */}
      <GoogleMapReact
        bootstrapURLKeys={{
          key: process.env.GOOGLE_MAPS_API_KEY || "",
        }}
        defaultZoom={4}
        defaultCenter={{ lat: -28.024, lng: 140.887 }}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map }) => {
          mapRef.current = map;
        }}
        onChange={({ zoom, bounds }) => {
          setZoom(zoom);
          setBounds([
            bounds.nw.lng,
            bounds.se.lat,
            bounds.se.lng,
            bounds.nw.lat,
          ]);
        }}
      >
        {console.log("clusters", markerClusters.clusters)}
        {markerClusters.clusters.map((cluster) => {
          const [lng, lat] = cluster.geometry.coordinates;
          // const { cluster: isCluster, point_count: pointCount } =
          //   cluster.properties?.cluster;
          //const { point_count: pointCount } = cluster.properties?.point_count;

          if (cluster.properties?.cluster) {
            return (
              <Marker key={cluster.id} lat={lat} lng={lng}>
                <div
                  style={{
                    color: "#ffffff",
                    backgroundColor: "#1978c8",
                    borderRadius: "50%",
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {cluster.properties?.point_count}
                </div>
              </Marker>
            );
          }

          return (
            <Marker lat={lat} lng={lng} key={cluster.properties?.cluster_id}>
              <button
                style={{
                  background: "none",
                  border: "none",
                }}
              >
                <FaMapMarkerAlt />
              </button>
            </Marker>
          );
        })}
        {/* {locations.map((location, index) => (
          <Marker lat={location.lat} lng={location.lng} key={index}>
            <button
              style={{
                background: "none",
                border: "none",
              }}
            >
              <FaMapMarkerAlt />
            </button>
          </Marker>
        ))} */}
      </GoogleMapReact>
    </div>
  );
};

export default Home;
