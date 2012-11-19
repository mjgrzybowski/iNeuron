Solver = function (systemDefinition) {
	this.systemDefinition = {};
	this.result = [];
	this.lastState = [];
	this.pars = [];
	this.dt = 0.25;
	this.t = 0;
	
	this.setSystemDefinition = function (systemDefinition) {
		//TODO jeśli dotychczasowe parametry są niekompatybline z systemem to je wywala
		this.systemDefinition = systemDefinition;
	};
	
	this.setParametersValues = function (parametersValues) {
		//TODO wywala błąd jeśli niekompatybilne z systemem,

		this.parametersValues = parametersValues;
		
		this.pars = [];
        var i = 0;
		for ( pId in this.parametersValues )
		{
			this.pars[i] = (this.parametersValues[pId]);
            i++;
		}

	};
	
	this.setVariablesInitValues = function (variablesInitValues) {
	
		//TODO wywala błąd jeśli niekompatybilne z systemem, 
		
		this.variablesInitValues = variablesInitValues;
		
		this.pars = [];
		

		
		for ( vId in this.variablesInitValues )
		{
			this.lastState.push(this.variablesInitValues[vId]);
		}
		
		this.result = [];
		
	};
	
	this.parseSystemDefinition = function(){
        //TODO przerobic tak aby po kazdej zmianie parametrow nei trzeba bylo od nowa parsowac definicji systemu
		this.system = {
			parameters : [],
			variables : [],
			equations : {},
			};
		
		this.pars = [];
		this.result = [];
		this.lastState = [];
		this.t = 0;
		
		for ( pId in this.parametersValues )
		{
			this.pars.push(this.parametersValues[pId]);
		}		
		
		for ( vId in this.variablesInitValues )
		{
			this.lastState.push(this.variablesInitValues[vId]);
		}	
		
		args = this.systemDefinition.variables.concat(this.systemDefinition.parameters).join(',');
		
		body = "{ var state = [];"

		for ( eqV in this.systemDefinition.equations ) {
			eq = this.systemDefinition.equations[eqV];
            if(eqV[0]=='D')
            {
                body += eqV.slice(1) + " += " + "this.dt * (" + eq + ");";
            }
            else
            {
                body += eqV + " = "  + eq + ";";
            }

		}
		
		
		for ( vId in this.systemDefinition.variables ) {
			body += "state.push(" + this.systemDefinition.variables[vId] +");";
		}
		
		body += "return state ;";
		
		body += "}";
		
		this.system.step = new Function(
			args,
			body	
		);
	

	
	};
	
	this.makeStep = function () {

		this.lastState = this.system.step.apply(this,this.lastState.concat(this.pars));

		this.result.push(this.lastState);
	};
	
    this.solve = function (Tmax) {
        while (this.t<Tmax)
        {
            this.makeStep();
            this.t += this.dt;
        }
	};

    this.getResultOfVariable = function(vId){


                var newArr = [],t = 0;

                for (vIds in this.systemDefinition.variables)
                {
                    if (this.systemDefinition.variables[vIds]==vId)
                    {
                        rvId = vIds;
                    }
                }

                for (row in this.result)
                {
                    newArr.push(this.result[row][rvId]);
                }

                return newArr;


        }

}





