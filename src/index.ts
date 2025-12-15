import dotenv from 'dotenv';
import { GamerBotAPI } from 'gamerbot-module';
import { getProfilesFromUsernames } from 'minecraft-api-wrapper';
dotenv.config();

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    const gamerbotInstance = new GamerBotAPI(process.env.GAMERBOT_TOKEN!);

    const minecraftUsers = await gamerbotInstance.models.getAllMinecraftUsers();

    const names = []
    for (const user of minecraftUsers) {
        names.push(user.name);
    } 

    console.log(`Fetching UUIDs for ${names.length} Minecraft users...`);
    const minecraftProfiles = await getProfilesFromUsernames(names);
    console.log(`Fetched ${minecraftProfiles?.length || 0} profiles.`);

    if (!minecraftProfiles) {
        console.log('No Minecraft profiles found.');
        return;
    }

    for (const profile of minecraftProfiles) {
        console.log(`Updating UUID for ${profile.getName()} to ${profile.getUUID()}`);
        const user = minecraftUsers.find(u => u.name.toLowerCase() === profile.getName().toLowerCase());
        const userData = await gamerbotInstance.models.getUserData(user!.discordId);
        userData.minecraftData.uuid = profile.getUUID();
        await userData.save();
        console.log(`Updated UUID for ${profile.getName()}`);
    }

})();

