import dotenv from 'dotenv';
import { GamerBotAPI } from 'gamerbot-module';
import { getProfileFromUUID } from 'minecraft-api-wrapper';
dotenv.config();

(async () => {
    const gamerbotInstance = new GamerBotAPI(process.env.GAMERBOT_TOKEN!);

    const minecraftUsers = await gamerbotInstance.models.getAllMinecraftUsers();

    for (const user of minecraftUsers) {
        const minecraftProfile = await getProfileFromUUID(user.uuid);
        console.log(`Fetched profile for UUID ${user.uuid}:`);
        if (minecraftProfile && minecraftProfile.getName() !== user.name) {
            console.log(`Updating username for UUID ${user.uuid} from ${user.name} to ${minecraftProfile.getName()}`);

            const userData = await gamerbotInstance.models.getUserData(user.discordId);
            userData.minecraftData.username = minecraftProfile.getName();
            await userData.save();
        }
    }
})();
