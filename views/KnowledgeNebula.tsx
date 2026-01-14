
import React, { useRef, useMemo, useEffect } from 'react';
// FIX: (Line 9) Removed `useThree` as it was causing an error and is not needed. The `state` object from `useFrame` provides the required properties.
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useNebula } from '../contexts/NebulaContext';

const Particles = () => {
    const ref = useRef<any>();
    const { triggerPulseRef } = useNebula();
    const pulseTimeRef = useRef(-1);

    const particles = useMemo(() => {
        const count = 5000;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 20;
        }
        return positions;
    }, []);

    useEffect(() => {
        triggerPulseRef.current = () => {
            pulseTimeRef.current = 0;
        };
    }, [triggerPulseRef]);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x += delta / 25;
            ref.current.rotation.y += delta / 30;

            // FIX: (Line 9) Using `state.mouse` and `state.viewport` from `useFrame`'s callback argument. This is more efficient and resolves the error with `useThree()`.
            const targetX = state.mouse.x * state.viewport.width / 5;
            const targetY = state.mouse.y * state.viewport.height / 5;
            ref.current.position.x += (targetX - ref.current.position.x) * 0.02;
            ref.current.position.y += (targetY - ref.current.position.y) * 0.02;
            ref.current.position.z += (-1 - ref.current.position.z) * 0.01;
        }
        if (ref.current.material) {
            if (pulseTimeRef.current >= 0) {
                pulseTimeRef.current += delta * 4;
                if (pulseTimeRef.current > 10) {
                    pulseTimeRef.current = -1; // Reset
                }
            }
            // This assumes a custom shader material is used
            if (ref.current.material.uniforms?.pulse) {
               ref.current.material.uniforms.pulse.value = pulseTimeRef.current;
            }
        }
    });

    return (
        <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
             <PointMaterial
                transparent
                color="#4A5568"
                size={0.015}
                sizeAttenuation={true}
                depthWrite={false}
             />
        </Points>
    );
};


const KnowledgeNebula = () => {
    // FIX: (Line 72) Replaced the `<ambientLight>` JSX primitive with an explicit `<primitive>` object.
    // This works around a likely TypeScript configuration issue where R3F's JSX elements are not recognized.
    const light = useMemo(() => new THREE.AmbientLight(0xffffff, 0.5), []);
    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[#0f172a]">
            <Canvas camera={{ position: [0, 0, 5] }}>
                <primitive object={light} />
                <Particles />
            </Canvas>
        </div>
    );
};

export default KnowledgeNebula;
