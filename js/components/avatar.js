const AVATAR_COLORS = ['#2563EB', '#0EA5E9', '#7C3AED', '#059669', '#D97706', '#DB2777','#EA580C', '#DC2626', '#16A34A', '#4F46E5', '#9333EA', '#0D9488', '#475569', '#65A30D', '#BE123C', '#84CC16'];

function getAvatarColor(seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export { getAvatarColor };
