const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const activityLogger = (actionDescription) => {
    return async (req, res, next) => {
        // We override the res.json/res.send to capture success before logging
        // Alternatively, log immediately depending on requirement
        // For simplicity, we fire-and-forget the log since admin actions are relatively safe.
        try {
            const adminName = req.admin?.name || req.admin?.email || 'Unknown Admin';
            // Extract some context if possible
            let fullAction = actionDescription;
            if (req.body?.name) fullAction += `: ${req.body.name}`;
            else if (req.params?.id) fullAction += ` ID: ${req.params.id}`;

            await prisma.activityLog.create({
                data: {
                    action: fullAction,
                    adminName,
                }
            });
        } catch (err) {
            console.error('Failed to log activity:', err);
        }
        next();
    };
};

module.exports = activityLogger;
