const Amaz = effect.Amaz;

class Feature
{
    onInit()
    {
        this.target_path = "";
    }

    onSetParameter(name, value)
    {
        if (name == "effects_colormigration_target_path")
        {
            this.target_path = value;
            return true;
        }
    }
   
    onBeforeAlgorithmUpdate(graphName)
    {
        if (this.target_path.length > 0)
        {
            var algorithm = Amaz.AmazingManager.getSingleton("Algorithm")
            algorithm.setAlgorithmParamStr(graphName, "general_lens_0", "colormatch_cache_path", this.target_path);
        }
    }
}

exports.Feature = Feature;